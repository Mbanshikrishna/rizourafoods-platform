export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Rizoura Foods API",
    version: "1.0.0",
    description:
      "Production-ready backend API for Rizoura Foods covering authentication, catalog, inquiries, and blog management.",
  },
  servers: [
    {
      url: "/",
      description: "Current environment",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          imageUrl: { type: "string", nullable: true },
          status: { type: "string", enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
        },
      },
      Blog: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          featuredImage: { type: "string", nullable: true },
          status: { type: "string", enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
        },
      },
      Inquiry: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          company: { type: "string", nullable: true },
          country: { type: "string", nullable: true },
          phone: { type: "string", nullable: true },
          inquiryType: {
            type: "string",
            enum: ["EXPORT", "BULK_ORDER", "CONTACT", "DISTRIBUTOR", "PRIVATE_LABEL", "GENERAL"],
          },
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Liveness check",
        responses: {
          200: { description: "Service is running" },
        },
      },
    },
    "/ready": {
      get: {
        summary: "Readiness check",
        responses: {
          200: { description: "Dependencies are ready" },
          503: { description: "Dependencies are not ready" },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        summary: "Authenticate admin user",
      },
    },
    "/api/v1/auth/refresh": {
      post: {
        summary: "Refresh access token",
      },
    },
    "/api/v1/products": {
      get: {
        summary: "List products with pagination and filters",
      },
      post: {
        summary: "Create product",
        security: [{ bearerAuth: [] }],
      },
    },
    "/api/v1/blogs": {
      get: {
        summary: "List blog entries",
      },
      post: {
        summary: "Create blog entry",
        security: [{ bearerAuth: [] }],
      },
    },
    "/api/v1/inquiries": {
      get: {
        summary: "List inquiries",
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: "Create inquiry",
      },
    },
    "/api/v1/inquiries/export": {
      get: {
        summary: "Export inquiries as CSV",
        security: [{ bearerAuth: [] }],
      },
    },
  },
};
