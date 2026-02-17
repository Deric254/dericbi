import { useEffect, useState } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/history");
        const data = await response.json();
        setItems(data.items || []);
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
          <p className="eyebrow">Report History</p>
          <h1>Your analytics timeline</h1>
          <p className="lede">View uploads, dashboards, and PDF exports.</p>
        </div>
        <Link className="cta" href="/home">
          Home
        </Link>
      </header>

      <section className="card">
        <h2>Past reports</h2>
        {status === "loading" && <p className="muted">Loading history...</p>}
        {status === "error" && (
          <p className="muted">Unable to load history.</p>
        )}
        {status === "ready" && items.length === 0 && (
          <p className="muted">No reports yet.</p>
        )}
        {status === "ready" && items.length > 0 && (
          <ul className="history-list">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <p className="label">{item.fileName}</p>
                  <p className="muted">{item.generatedAt}</p>
                </div>
                <a className="link" href={item.reportUrl}>
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
