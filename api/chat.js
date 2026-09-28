// api/chat.js
//
// Server-side AI proxy for the DAI chatbot.
//
// WHY THIS FILE EXISTS
// ---------------------
// The old chatbot called the Hugging Face inference API directly from the
// browser with a hardcoded API key sitting in plain, public JavaScript.
// That key was visible to anyone who opened dev tools — a real security
// leak. This endpoint fixes that architecture permanently: every API key
// lives ONLY as a server-side environment variable on Vercel and NEVER
// reaches the browser. The front end calls THIS endpoint (same origin,
// no key needed); this endpoint calls whichever AI provider you've
// configured, using the secret key from the server environment.
//
// PROVIDERS SUPPORTED (configure any subset — none are required)
// ---------------------------------------------------------------
//   NVIDIA_API_KEY     -> NVIDIA NIM free-tier catalog (build.nvidia.com)
//   OPENAI_API_KEY      -> OpenAI
//   GEMINI_API_KEY       -> Google Gemini
//   ANTHROPIC_API_KEY  -> Claude
//
// Set these in Vercel: Project -> Settings -> Environment Variables.
// You only need ONE key for the chatbot's AI layer to activate. If NONE
// are set, or every provider call fails, this endpoint tells the front
// end to fall back to the built-in knowledge-base responses — the site
// and chatbot keep working exactly as before, with zero AI cost/config.
//
// Optional overrides (set only if you want a non-default model):
//   NVIDIA_MODEL, OPENAI_MODEL, GEMINI_MODEL, ANTHROPIC_MODEL
//   AI_PROVIDER_ORDER   e.g. "openai,gemini"  (default: nvidia,openai,gemini,anthropic)

const DEFAULT_MODELS = {
  nvidia: 'meta/llama-3.3-70b-instruct',
  openai: 'gpt-5-nano',
  gemini: 'gemini-3.1-flash-lite',
  anthropic: 'claude-haiku-4-5-20251001'
};

const PROVIDER_TIMEOUT_MS = 8000;
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;

// Single source of truth for what the AI is allowed to know and say about
// the business. Keep this in sync with assets/js/chatbot.js knowledgeBase
// if core facts (pricing, contact, programs) ever change.
const BUSINESS_CONTEXT = `You are DAI, the AI assistant embedded on the dericBI website (a small chat
widget, not a full page — keep every reply to 2-4 short sentences, plain
text, no markdown headers).

ABOUT dericBI:
- Kenyan data analytics company, founded 2023 in Meru, Kenya, by CEO Deric Marangu.
- Deric Marangu: Bachelor's in Business Information Technology, Kirinyaga University (2025). Skilled in SQL, Python, Power BI, Excel.
- 40+ completed projects across retail, healthcare, finance, education, manufacturing, agriculture, real estate and government.
- Typical turnaround: 3-7 days. Pricing starts around $20 / KSh 2,600 for smaller jobs; exact quotes depend on scope.

SERVICES: Excel cleanup and automation, Power BI and Excel dashboards, Python-based statistical analysis and data cleaning, SQL data extraction and reporting, business intelligence consulting.

TUJENGANE EDUCATION PROGRAMS (data literacy training):
- Data Basics: FREE (data collection, cleaning, storage basics).
- Digital Literacy: $10 per module.
- Analyst Pro: $10 per module (Excel, Power BI, SQL, Python, real projects).
- Complete package: $100 for all education services.

TECH STACK: HTML/Tailwind/JavaScript frontend; Python, SQL, Power BI, Excel, Pandas, NumPy, Matplotlib/Seaborn for analytics; hosted on GitHub Pages/Vercel.

CONTACT (always give these when a question needs a human, a quote, or something you're unsure about):
- WhatsApp: +254791360805 (fastest response)
- Email: dericmarangu@gmail.com

RULES:
- Only state facts from this context. Never invent prices, dates, staff, or guarantees not listed here.
- If asked something outside this context (or anything you're not confident about), say so briefly and point them to WhatsApp or email above.
- Be warm, concise, and helpful. No walls of text — this is a small popup widget.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY_TURNS) : [];
    const pageContext = typeof body.context === 'string' ? body.context.slice(0, 60) : '';

    if (!message) {
      return res.status(400).json({ error: 'Missing message', fallback: true });
    }
    const safeMessage = message.slice(0, MAX_MESSAGE_LENGTH);

    const order = (process.env.AI_PROVIDER_ORDER || 'nvidia,openai,gemini,anthropic')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const systemPrompt = pageContext
      ? `${BUSINESS_CONTEXT}\n\nThe visitor is currently on the "${pageContext}" section of the site.`
      : BUSINESS_CONTEXT;

    for (const provider of order) {
      if (!hasKey(provider)) continue;
      try {
        const reply = await callProvider(provider, systemPrompt, safeMessage, history);
        if (reply && reply.trim().length > 1) {
          return res.status(200).json({ reply: reply.trim(), provider });
        }
      } catch (err) {
        console.error(`[api/chat] ${provider} failed:`, err.message);
        // try the next configured provider
      }
    }

    // No provider configured, or all failed — front end falls back to its
    // own built-in knowledge-base responses. This is a normal, expected
    // outcome, not an error.
    return res.status(200).json({ reply: null, fallback: true });
  } catch (err) {
    console.error('[api/chat] unexpected error:', err);
    return res.status(200).json({ reply: null, fallback: true });
  }
};

function hasKey(provider) {
  switch (provider) {
    case 'nvidia': return !!process.env.NVIDIA_API_KEY;
    case 'openai': return !!process.env.OPENAI_API_KEY;
    case 'gemini': return !!process.env.GEMINI_API_KEY;
    case 'anthropic': return !!process.env.ANTHROPIC_API_KEY;
    default: return false;
  }
}

function callProvider(provider, systemPrompt, message, history) {
  switch (provider) {
    case 'nvidia':
      return callOpenAiCompatible(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        process.env.NVIDIA_API_KEY,
        process.env.NVIDIA_MODEL || DEFAULT_MODELS.nvidia,
        systemPrompt, message, history
      );
    case 'openai':
      return callOpenAiCompatible(
        'https://api.openai.com/v1/chat/completions',
        process.env.OPENAI_API_KEY,
        process.env.OPENAI_MODEL || DEFAULT_MODELS.openai,
        systemPrompt, message, history
      );
    case 'gemini':
      return callGemini(
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_MODEL || DEFAULT_MODELS.gemini,
        systemPrompt, message, history
      );
    case 'anthropic':
      return callAnthropic(
        process.env.ANTHROPIC_API_KEY,
        process.env.ANTHROPIC_MODEL || DEFAULT_MODELS.anthropic,
        systemPrompt, message, history
      );
    default:
      return Promise.reject(new Error(`Unknown provider: ${provider}`));
  }
}

function withTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

function toOpenAiMessages(systemPrompt, message, history) {
  const msgs = [{ role: 'system', content: systemPrompt }];
  for (const turn of history) {
    if (turn && turn.role && turn.content) {
      msgs.push({ role: turn.role === 'bot' ? 'assistant' : 'user', content: String(turn.content).slice(0, 500) });
    }
  }
  msgs.push({ role: 'user', content: message });
  return msgs;
}

async function callOpenAiCompatible(url, apiKey, model, systemPrompt, message, history) {
  const { signal, cancel } = withTimeout(PROVIDER_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: toOpenAiMessages(systemPrompt, message, history),
        max_tokens: 220,
        temperature: 0.6
      }),
      signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : null;
  } finally {
    cancel();
  }
}

async function callGemini(apiKey, model, systemPrompt, message, history) {
  const { signal, cancel } = withTimeout(PROVIDER_TIMEOUT_MS);
  try {
    const contents = [];
    for (const turn of history) {
      if (turn && turn.role && turn.content) {
        contents.push({
          role: turn.role === 'bot' ? 'model' : 'user',
          parts: [{ text: String(turn.content).slice(0, 500) }]
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 220, temperature: 0.6 }
      }),
      signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
    return parts && parts[0] ? parts[0].text : null;
  } finally {
    cancel();
  }
}

async function callAnthropic(apiKey, model, systemPrompt, message, history) {
  const { signal, cancel } = withTimeout(PROVIDER_TIMEOUT_MS);
  try {
    const messages = [];
    for (const turn of history) {
      if (turn && turn.role && turn.content) {
        messages.push({ role: turn.role === 'bot' ? 'assistant' : 'user', content: String(turn.content).slice(0, 500) });
      }
    }
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        messages,
        max_tokens: 220
      }),
      signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const block = data && data.content && data.content.find(b => b.type === 'text');
    return block ? block.text : null;
  } finally {
    cancel();
  }
}
