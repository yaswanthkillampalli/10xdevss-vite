const normalizeOptionalString = (value) => {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
};

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const isValidHttpUrl = (value) => {
  if (value === null || value === undefined || value === "") return true;

  try {
    const parsed = new URL(String(value).trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const parseFlexibleDate = (value) => {
  if (value === undefined || value === null || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? value : value;
  }

  if (typeof value === "number") {
    const parsedFromNumber = new Date(value);
    return Number.isNaN(parsedFromNumber.getTime()) ? value : parsedFromNumber;
  }

  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return null;

    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime())) return parsed;

    const monthYearMatch = text.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
    if (monthYearMatch) {
      const parsedMonthYear = new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`);
      if (!Number.isNaN(parsedMonthYear.getTime())) return parsedMonthYear;
    }

    const yearMonthMatch = text.match(/^(\d{4})-(\d{2})$/);
    if (yearMonthMatch) {
      const parsedYearMonth = new Date(`${yearMonthMatch[1]}-${yearMonthMatch[2]}-01`);
      if (!Number.isNaN(parsedYearMonth.getTime())) return parsedYearMonth;
    }

    return text;
  }

  return value;
};

module.exports = {
  isValidHttpUrl,
  normalizeOptionalString,
  normalizeStringArray,
  parseFlexibleDate,
};