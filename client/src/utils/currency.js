export const formatCurrency = (amount, compact = false) => {
  if (amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    notation: compact && amount >= 100000 ? "compact" : "standard",
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
};

export const formatDateInput = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toISOString().split("T")[0];
};
