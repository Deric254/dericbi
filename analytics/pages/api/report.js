export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    reportUrl: "https://example.com/reports/dericbi-latest.pdf",
    dashboardUrl: "/dashboard",
    message: "Report queued. Wire jsPDF + Blob storage to generate the PDF.",
  });
}
