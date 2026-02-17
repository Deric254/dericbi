export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fileName, fileType, fileSize } = req.body || {};
  if (!fileName) {
    return res.status(400).json({ error: "fileName is required." });
  }

  const uploadId = Math.floor(Date.now() / 1000);

  return res.status(200).json({
    uploadId,
    fileName,
    fileType: fileType || "unknown",
    fileSize: fileSize || 0,
    message: "Metadata stored. Wire Vercel Blob + Prisma for real uploads.",
  });
}
