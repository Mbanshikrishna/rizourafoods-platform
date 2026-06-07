const FORMULA_PREFIXES = new Set(["=", "+", "-", "@", "\t", "\r"]);

const sanitizeCell = (value: unknown): string => {
  const str = value == null ? "" : String(value);

  // Neutralize CSV injection: prefix dangerous values with a single quote.
  // Strip leading spaces (but not tabs/CR which are themselves dangerous prefixes)
  // so that " =CMD()" is also caught.
  const stripped = str.replace(/^ +/, "");
  if (stripped.length > 0 && FORMULA_PREFIXES.has(stripped[0])) {
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
