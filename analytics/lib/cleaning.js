export function summarizeCleaningStats(rows) {
  if (!Array.isArray(rows)) {
    return {
      rows: 0,
      missingValues: 0,
      duplicates: 0,
    };
  }

  return {
    rows: rows.length,
    missingValues: 0,
    duplicates: 0,
  };
}
