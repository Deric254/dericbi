import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/clean", { method: "POST" });
        const data = await response.json();
        setSummary(data);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
      }
    };
    load();
  }, []);

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Insight Dashboard</p>
          <h1>Interactive analytics preview</h1>
          <p className="lede">
            A serverless snapshot showing cleaning stats and next steps for your
            charts.
          </p>
        </div>
        <Link className="cta" href="/home">
          Home
        </Link>
      </header>

      <section className="card">
        <h2>Cleaning summary</h2>
        {status === "loading" && <p className="muted">Loading...</p>}
        {status === "error" && (
          <p className="muted">Unable to load summary.</p>
        )}
        {status === "ready" && summary && (
          <div className="summary-grid">
            <div>
              <p className="label">Rows analyzed</p>
              <p className="value">{summary.rows}</p>
            </div>
            <div>
              <p className="label">Missing values</p>
              <p className="value">{summary.missingValues}</p>
            </div>
            <div>
              <p className="label">Duplicate rows</p>
              <p className="value">{summary.duplicates}</p>
            </div>
          </div>
        )}
      </section>

      <section className="grid">
        <div className="panel">
          <h3>Chart placeholders</h3>
          <p>
            Wire Chart.js or Plotly in this panel to render actual visualizations
            using the cleaned dataset.
          </p>
        </div>
        <div className="panel">
          <h3>Next recommendations</h3>
          <p>{summary?.recommendation || "Generate a PDF report to share."}</p>
        </div>
      </section>
    </main>
  );
}
