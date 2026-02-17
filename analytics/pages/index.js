import { useState } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setStatus("error");
      setMessage("Select a file to continue.");
      return;
    }

    setStatus("loading");
    setMessage("Uploading metadata...");

    try {
      const payload = {
        fileName: file.name,
        fileType: file.type || "unknown",
        fileSize: file.size,
      };

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setStatus("success");
      setMessage(`Uploaded: ${data.fileName}. Upload ID: ${data.uploadId}`);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Unexpected error.");
    }
  };

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">DericBI Analytics</p>
          <h1>Data in. Cash out.</h1>
          <p className="lede">
            Upload CSV, Excel, or JSON to generate branded insights and reports
            entirely inside Vercel.
          </p>
        </div>
        <Link className="cta" href="/home">
          Home
        </Link>
      </header>

      <section className="card">
        <h2>Upload your dataset</h2>
        <p className="muted">
          This demo logs metadata only. Wire Vercel Blob and Prisma to store
          files and records.
        </p>
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Uploading..." : "Upload"}
          </button>
        </form>
        {message && (
          <div className={`status ${status}`} role="status">
            {message}
          </div>
        )}
      </section>

      <section className="grid">
        <Link className="panel" href="/dashboard">
          <h3>Dashboard</h3>
          <p>Explore cleaning summaries and visual trends.</p>
        </Link>
        <Link className="panel" href="/history">
          <h3>History</h3>
          <p>Download prior reports and dashboards.</p>
        </Link>
      </section>
    </main>
  );
}
