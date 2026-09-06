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
    "/api/v1/me/business": {
      get: { summary: "Get the authenticated customer's business profile", security: [{ bearerAuth: [] }], responses: { 200: { description: "Customer-visible business profile" }, 401: { description: "Customer authentication required" } } },
      patch: { summary: "Update the authenticated customer's permitted business-profile fields", security: [{ bearerAuth: [] }], responses: { 200: { description: "Business profile updated" }, 422: { description: "Validation error" } } },
    },
    "/api/v1/me/contacts": {
      get: { summary: "List the authenticated customer's contacts", security: [{ bearerAuth: [] }], responses: { 200: { description: "Contacts" } } },
      post: { summary: "Create a contact for the authenticated customer", security: [{ bearerAuth: [] }], responses: { 201: { description: "Contact created" } } },
    },
    "/api/v1/me/addresses": {
      get: { summary: "List the authenticated customer's addresses", security: [{ bearerAuth: [] }], responses: { 200: { description: "Addresses" } } },
      post: { summary: "Create an address for the authenticated customer", security: [{ bearerAuth: [] }], responses: { 201: { description: "Address created" } } },
    },
    "/api/v1/crm/customers": {
      get: { summary: "List CRM customers with pagination and filters", description: "Requires ADMIN, SALES, or VIEWER. Filters: status, businessType, city, state, createdFrom, createdTo, search.", security: [{ bearerAuth: [] }], responses: { 200: { description: "Paginated CRM customers" }, 403: { description: "CRM role required" } } },
    },
    "/api/v1/crm/customers/{id}": {
      get: { summary: "Get CRM customer detail", description: "Requires ADMIN, SALES, or VIEWER. VIEWER receives a restricted internal-data view.", security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "CRM customer detail" }, 404: { description: "Customer not found" } } },
    },
    "/api/v1/crm/customers/{id}/approve": { post: { summary: "Approve a pending customer", description: "ADMIN only; PENDING to ACTIVE.", security: [{ bearerAuth: [] }], responses: { 200: { description: "Customer approved" }, 409: { description: "Invalid status transition" } } } },
    "/api/v1/crm/customers/{id}/suspend": { post: { summary: "Suspend an active customer", description: "ADMIN only; ACTIVE to SUSPENDED.", security: [{ bearerAuth: [] }], responses: { 200: { description: "Customer suspended" }, 409: { description: "Invalid status transition" } } } },
    "/api/v1/crm/customers/{id}/business": { patch: { summary: "Update internal CRM business-profile fields", description: "ADMIN or SALES only.", security: [{ bearerAuth: [] }], responses: { 200: { description: "Business profile updated" } } } },
    "/api/v1/crm/customers/{id}/business/review": { post: { summary: "Approve or reject a pending business profile", description: "ADMIN only.", security: [{ bearerAuth: [] }], responses: { 200: { description: "Business profile reviewed" }, 409: { description: "Invalid status transition" } } } },
    "/api/v1/crm/customers/{id}/contacts": { get: { summary: "List CRM customer contacts", security: [{ bearerAuth: [] }], responses: { 200: { description: "Contacts" } } }, post: { summary: "Create CRM customer contact", description: "ADMIN or SALES only.", security: [{ bearerAuth: [] }], responses: { 201: { description: "Contact created" } } } },
    "/api/v1/crm/customers/{id}/addresses": { get: { summary: "List CRM customer addresses", security: [{ bearerAuth: [] }], responses: { 200: { description: "Addresses" } } }, post: { summary: "Create CRM customer address", description: "ADMIN or SALES only.", security: [{ bearerAuth: [] }], responses: { 201: { description: "Address created" } } } },
    "/api/v1/crm/customers/{id}/activities": { get: { summary: "List internal CRM activities", description: "ADMIN, SALES, or VIEWER. Customers cannot access this endpoint.", security: [{ bearerAuth: [] }], responses: { 200: { description: "Paginated activity history" } } }, post: { summary: "Create internal CRM activity", description: "ADMIN or SALES only; creator is derived from the authenticated user.", security: [{ bearerAuth: [] }], responses: { 201: { description: "Activity created" }, 422: { description: "Contact/customer mismatch" } } } },
  },
};
