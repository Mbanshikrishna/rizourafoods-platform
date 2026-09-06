import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("server startup architecture", () => {
  it("does not provision a default admin during API startup", () => {
    const serverSource = readFileSync(resolve(__dirname, "../src/server.ts"), "utf8");

    expect(serverSource).not.toContain("seedDefaultAdmin");
    expect(serverSource).toContain("await prisma.$connect()");
    expect(serverSource).toContain("app.listen(env.PORT");
  });
});
