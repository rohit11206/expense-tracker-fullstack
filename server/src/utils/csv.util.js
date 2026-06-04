// Converts an array of expense objects to a CSV string
export const convertToCSV = (expenses) => {
  if (!expenses.length) return "";

  const headers = ["id", "amount", "category", "date", "note", "createdAt"];

  const rows = expenses.map((e) => [
    e._id,
    e.amount,
    e.category,
    new Date(e.date).toISOString().split("T")[0],
    (e.note || "").replace(/,/g, ";"), // escape commas in notes
    new Date(e.createdAt).toISOString(),
  ]);

  const csvLines = [headers.join(","), ...rows.map((r) => r.join(","))];
  return csvLines.join("\n");
};
