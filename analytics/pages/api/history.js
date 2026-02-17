export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    items: [
      {
        id: 1,
        fileName: "retail_sales_q1.csv",
        generatedAt: "2026-02-17",
        reportUrl: "https://example.com/reports/retail-sales-q1.pdf",
      },
      {
        id: 2,
        fileName: "marketing_spend.xlsx",
        generatedAt: "2026-02-12",
        reportUrl: "https://example.com/reports/marketing-spend.pdf",
      },
    ],
  });
}
