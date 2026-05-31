export const toCsv = <T extends Record<string, unknown>>(rows: T[]) => {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: unknown) => {
    const stringValue = value == null ? "" : String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const headerLine = headers.join(",");
  const valueLines = rows.map((row) => headers.map((header) => escapeCell(row[header])).join(","));
  return [headerLine, ...valueLines].join("\n");
};
