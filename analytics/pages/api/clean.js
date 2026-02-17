export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    rows: 1240,
    missingValues: 18,
    duplicates: 3,
    recommendation: "Confirm outliers, then generate a branded PDF report.",
  });
}
