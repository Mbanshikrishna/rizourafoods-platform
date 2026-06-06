import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../src/repositories/blogRepository", () => ({
  blogRepository: {
    findById: vi.fn(),
    update: vi.fn(),
  },
}));

import { blogService } from "../src/services/blogService";
import { blogRepository } from "../src/repositories/blogRepository";

const mockBlog = {
  id: "blog-1",
  title: "Test Blog",
  slug: "test-blog",
  content: "Some content that is long enough",
  featuredImage: null,
  status: "PUBLISHED" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("blogService.update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(blogRepository.findById).mockResolvedValue(mockBlog);
    vi.mocked(blogRepository.update).mockImplementation(async (_id, data) => ({
      ...mockBlog,
      ...data,
    }) as never);
  });

  it("includes title in update payload when provided", async () => {
    await blogService.update("blog-1", { title: "New Title" });

    expect(blogRepository.update).toHaveBeenCalledWith("blog-1", expect.objectContaining({
      title: "New Title",
    }));
  });

  it("does not include title when not provided", async () => {
    await blogService.update("blog-1", { content: "Updated content" });

    const updatePayload = vi.mocked(blogRepository.update).mock.calls[0][1];
    expect(updatePayload).not.toHaveProperty("title");
  });

  it("includes content even when set to empty string", async () => {
    await blogService.update("blog-1", { content: "" });

    expect(blogRepository.update).toHaveBeenCalledWith("blog-1", expect.objectContaining({
      content: "",
    }));
  });

  it("includes slug and converts it via toSlug", async () => {
    await blogService.update("blog-1", { slug: "My New Slug" });

    expect(blogRepository.update).toHaveBeenCalledWith("blog-1", expect.objectContaining({
      slug: "my-new-slug",
    }));
  });

  it("includes featuredImage when set to null (clearing the field)", async () => {
    await blogService.update("blog-1", { featuredImage: null as unknown as string });

    expect(blogRepository.update).toHaveBeenCalledWith("blog-1", expect.objectContaining({
      featuredImage: null,
    }));
  });

  it("includes status when provided", async () => {
    await blogService.update("blog-1", { status: "DRAFT" });

    expect(blogRepository.update).toHaveBeenCalledWith("blog-1", expect.objectContaining({
      status: "DRAFT",
    }));
  });

  it("passes only provided fields to repository", async () => {
    await blogService.update("blog-1", { title: "Updated" });

    const updatePayload = vi.mocked(blogRepository.update).mock.calls[0][1];
    expect(Object.keys(updatePayload)).toEqual(["title"]);
  });
});
