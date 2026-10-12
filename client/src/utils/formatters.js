export const formatDate = (value) =>
  value ? new Intl.DateTimeFormat("en-IN").format(new Date(value)) : "-";

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value || 0));
