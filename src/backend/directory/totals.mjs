function summarizeDirectoryTotals(entries) {
  return entries.reduce(
    (totals, entry) => {
      if (entry.stats && !entry.stats.isDirectory()) {
        totals.fileCount += 1;
        totals.totalBytes += entry.stats.size;
      }
      return totals;
    },
    { fileCount: 0, totalBytes: 0 },
  );
}

export default function __moduleApi0() {
  return { summarizeDirectoryTotals };
}
