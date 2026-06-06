import { describe, expect, it } from "vitest";
import { toCsv } from "../src/utils/csv";

describe("toCsv", () => {
  it("returns empty string for empty array", () => {
    expect(toCsv([])).toBe("");
  });

  it("produces header and value rows", () => {
    const result = toCsv([{ name: "Alice", age: 30 }]);
    expect(result).toBe("name,age\nAlice,30");
  });

  it("escapes cells containing commas", () => {
    const result = toCsv([{ note: "hello, world" }]);
    expect(result).toBe('note\n"hello, world"');
  });

  it("escapes cells containing double quotes", () => {
    const result = toCsv([{ note: 'say "hi"' }]);
    expect(result).toBe('note\n"say ""hi"""');
  });

  it("escapes cells containing newlines", () => {
    const result = toCsv([{ note: "line1\nline2" }]);
    expect(result).toBe('note\n"line1\nline2"');
  });

  it("converts null and undefined to empty string", () => {
    const result = toCsv([{ a: null, b: undefined }]);
    expect(result).toBe("a,b\n,");
  });

  // CSV injection tests
  it("neutralizes cells starting with =", () => {
    const result = toCsv([{ val: "=CMD()" }]);
    expect(result).toBe("val\n'=CMD()");
  });

  it("neutralizes cells starting with +", () => {
    const result = toCsv([{ val: "+1234" }]);
    expect(result).toBe("val\n'+1234");
  });

  it("neutralizes cells starting with -", () => {
    const result = toCsv([{ val: "-1234" }]);
    expect(result).toBe("val\n'-1234");
  });

  it("neutralizes cells starting with @", () => {
    const result = toCsv([{ val: "@SUM(A1)" }]);
    expect(result).toBe("val\n'@SUM(A1)");
  });

  it("neutralizes cells with leading whitespace before formula prefix", () => {
    const result = toCsv([{ val: "  =CMD()" }]);
    expect(result).toBe("val\n'  =CMD()");
  });

  it("neutralizes cells with tab before formula prefix", () => {
    const result = toCsv([{ val: " \t=CMD()" }]);
    expect(result).toBe("val\n' \t=CMD()");
  });

  it("neutralizes cells starting with tab character", () => {
    const result = toCsv([{ val: "\tmalicious" }]);
    expect(result).toBe("val\n'\tmalicious");
  });

  it("does not prefix safe values", () => {
    const result = toCsv([{ val: "hello" }]);
    expect(result).toBe("val\nhello");
  });

  it("handles multiple rows", () => {
    const result = toCsv([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ]);
    expect(result).toBe("id,name\n1,Alice\n2,Bob");
  });
});
