export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
