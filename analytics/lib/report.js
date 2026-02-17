export function buildReportMetadata({ title, author }) {
  return {
    title: title || "DericBI Analytics Report",
    author: author || "DericBI",
    slogan: "Data in. Cash out.",
  };
}
