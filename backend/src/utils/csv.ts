const FORMULA_PREFIXES = new Set(["=", "+", "-", "@", "\t", "\r"]);

const sanitizeCell = (value: unknown): string => {
  const str = value == null ? "" : String(value);

  // Neutralize CSV injection: prefix dangerous values with a single quote
  if (str.length > 0 && FORMULA_PREFIXES.has(str[0])) {
    return `'${str}`;
  }

  return str;
};

const escapeCell = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const toCsv = <T extends Record<string, unknown>>(rows: T[]) => {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const headerLine = headers.join(",");
  const valueLines = rows.map((row) =>
    headers.map((header) => escapeCell(sanitizeCell(row[header]))).join(","),
  );
  return [headerLine, ...valueLines].join("\n");
};
