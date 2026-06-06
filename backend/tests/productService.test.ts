import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the repository before importing the service
vi.mock("../src/repositories/productRepository", () => ({
  productRepository: {
    findById: vi.fn(),
    update: vi.fn(),
  },
}));

import { productService } from "../src/services/productService";
import { productRepository } from "../src/repositories/productRepository";

const mockProduct = {
  id: "prod-1",
  name: "Heritage Basmati",
  slug: "heritage-basmati",
  description: "Aged for 2+ years",
  category: "basmati",
  imageUrl: null,
  status: "PUBLISHED" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("productService.update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);
    vi.mocked(productRepository.update).mockImplementation(async (_id, data) => ({
      ...mockProduct,
      ...data,
    }) as never);
  });

  it("includes name in update payload when provided", async () => {
    await productService.update("prod-1", { name: "New Name" });

    expect(productRepository.update).toHaveBeenCalledWith("prod-1", expect.objectContaining({
      name: "New Name",
    }));
  });

  it("does not include name when not provided", async () => {
    await productService.update("prod-1", { category: "premium" });

    const updatePayload = vi.mocked(productRepository.update).mock.calls[0][1];
    expect(updatePayload).not.toHaveProperty("name");
  });

  it("includes description even when set to empty string", async () => {
    await productService.update("prod-1", { description: "" });

    expect(productRepository.update).toHaveBeenCalledWith("prod-1", expect.objectContaining({
      description: "",
    }));
  });

  it("includes category even when set to empty string", async () => {
    await productService.update("prod-1", { category: "" });

    expect(productRepository.update).toHaveBeenCalledWith("prod-1", expect.objectContaining({
      category: "",
    }));
  });

  it("includes slug and converts it via toSlug", async () => {
    await productService.update("prod-1", { slug: "My New Slug" });

    expect(productRepository.update).toHaveBeenCalledWith("prod-1", expect.objectContaining({
      slug: "my-new-slug",
    }));
  });

  it("includes imageUrl when set to null (clearing the field)", async () => {
    await productService.update("prod-1", { imageUrl: null as unknown as string });

    expect(productRepository.update).toHaveBeenCalledWith("prod-1", expect.objectContaining({
      imageUrl: null,
    }));
  });

  it("includes status when provided", async () => {
    await productService.update("prod-1", { status: "DRAFT" });

    expect(productRepository.update).toHaveBeenCalledWith("prod-1", expect.objectContaining({
      status: "DRAFT",
    }));
  });

  it("passes only provided fields to repository", async () => {
    await productService.update("prod-1", { name: "Updated" });

    const updatePayload = vi.mocked(productRepository.update).mock.calls[0][1];
    expect(Object.keys(updatePayload)).toEqual(["name"]);
  });
});
