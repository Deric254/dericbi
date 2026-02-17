import { useEffect } from "react";

export default function HomeRedirect() {
  useEffect(() => {
    window.location.href = "https://dericbi.vercel.app/home.html";
  }, []);

  return (
    <main className="shell">
      <section className="card">
        <h1>Redirecting...</h1>
        <p className="muted">
          If you are not redirected, use the link below.
        </p>
        <a className="link" href="https://dericbi.vercel.app/home.html">
          Go to Home
        </a>
      </section>
    </main>
  );
}
