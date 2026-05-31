import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("health endpoints", () => {
  it("returns liveness status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.timestamp).toBeTruthy();
  });
});
