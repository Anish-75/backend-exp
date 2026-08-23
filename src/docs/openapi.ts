const errorResponse = {
  description: "Error response",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/Error" },
    },
  },
};

const authenticated = [{ bearerAuth: [] }];

export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "School ERP API",
    version: "1.0.0",
    description: "Authentication and administration API for the school ERP.",
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "Health", description: "Service status" },
    { name: "Authentication", description: "Session and password operations" },
    { name: "Institutions", description: "Institution administration" },
    { name: "Institution admins", description: "Institution administrator accounts" },
    { name: "Users", description: "User administration" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        responses: {
          "200": {
            description: "The API is healthy",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Health" } } },
          },
        },
      },
    },
    "/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get the current user session",
        security: authenticated,
        responses: {
          "200": {
            description: "Authenticated user",
            content: { "application/json": { schema: { $ref: "#/components/schemas/MeResponse" } } },
          },
          "401": errorResponse,
          "403": errorResponse,
        },
      },
    },
    "/set-new-password": {
      post: {
        tags: ["Authentication"],
        summary: "Replace a temporary password",
        security: authenticated,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SetNewPasswordRequest" } } },
        },
        responses: {
          "200": {
            description: "Password updated",
            content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } },
          },
          "400": errorResponse,
          "401": errorResponse,
        },
      },
    },
    "/institutions": {
      post: {
        tags: ["Institutions"],
        summary: "Create an institution and its first administrator",
        security: authenticated,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateInstitutionRequest" } } },
        },
        responses: {
          "201": { description: "Institution and administrator created", content: { "application/json": { schema: { type: "object" } } } },
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
        },
      },
    },
    "/institutions/{id}": {
      parameters: [{ $ref: "#/components/parameters/Id" }],
      patch: {
        tags: ["Institutions"],
        summary: "Update an institution",
        security: authenticated,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateInstitutionRequest" } } },
        },
        responses: {
          "200": { description: "Institution updated", content: { "application/json": { schema: { type: "object" } } } },
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
        },
      },
      delete: {
        tags: ["Institutions"],
        summary: "Archive an institution",
        security: authenticated,
        responses: {
          "200": { description: "Institution archived", content: { "application/json": { schema: { type: "object" } } } },
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
        },
      },
    },
    "/institutions/{id}/admin": {
      parameters: [{ $ref: "#/components/parameters/Id" }],
      post: {
        tags: ["Institution admins"],
        summary: "Replace an institution administrator",
        security: authenticated,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AdminRequest" } } },
        },
        responses: {
          "201": { description: "Administrator created", content: { "application/json": { schema: { $ref: "#/components/schemas/CreatedUserResponse" } } } },
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
        },
      },
    },
    "/admins": {
      post: {
        tags: ["Institution admins"],
        summary: "Create an institution administrator",
        security: authenticated,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateAdminRequest" } } },
        },
        responses: {
          "201": { description: "Administrator created", content: { "application/json": { schema: { $ref: "#/components/schemas/CreatedUserResponse" } } } },
          "401": errorResponse,
          "403": errorResponse,
        },
      },
    },
    "/admins/{id}": {
      parameters: [{ $ref: "#/components/parameters/Id" }],
      patch: {
        tags: ["Institution admins"],
        summary: "Update an institution administrator",
        security: authenticated,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateAdminRequest" } } },
        },
        responses: { "200": { description: "Administrator updated", content: { "application/json": { schema: { type: "object" } } } }, "400": errorResponse, "401": errorResponse, "403": errorResponse },
      },
      delete: {
        tags: ["Institution admins"],
        summary: "Archive an institution administrator",
        security: authenticated,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ScopedRequest" } } },
        },
        responses: { "200": { description: "Administrator archived", content: { "application/json": { schema: { type: "object" } } } }, "400": errorResponse, "401": errorResponse, "403": errorResponse },
      },
    },
    "/users": {
      post: {
        tags: ["Users"],
        summary: "Create an administrator user",
        description: "Currently only the ADMIN role is supported.",
        security: authenticated,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } },
        },
        responses: {
          "201": { description: "User created", content: { "application/json": { schema: { $ref: "#/components/schemas/CreatedUserResponse" } } } },
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
        },
      },
    },
    "/users/{id}": {
      parameters: [{ $ref: "#/components/parameters/Id" }],
      patch: {
        tags: ["Users"],
        summary: "Update a user",
        security: authenticated,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUserRequest" } } },
        },
        responses: { "200": { description: "User updated", content: { "application/json": { schema: { type: "object" } } } }, "400": errorResponse, "401": errorResponse, "403": errorResponse },
      },
      delete: {
        tags: ["Users"],
        summary: "Archive a user",
        security: authenticated,
        responses: { "200": { description: "User archived", content: { "application/json": { schema: { type: "object" } } } }, "400": errorResponse, "401": errorResponse, "403": errorResponse },
      },
    },
    "/api/auth/{endpoint}": {
      parameters: [{ name: "endpoint", in: "path", required: true, description: "Better Auth endpoint, such as sign-in/email or sign-out", schema: { type: "string" } }],
      post: {
        tags: ["Authentication"],
        summary: "Better Auth endpoint",
        description: "Better Auth handles sign-in, sign-out, session, and account operations under this route. Refer to the Better Auth endpoint for the operation-specific request and response schema.",
        requestBody: { required: false, content: { "application/json": { schema: { type: "object", additionalProperties: true } } } },
        responses: { "200": { description: "Better Auth response", content: { "application/json": { schema: { type: "object", additionalProperties: true } } } }, "400": errorResponse, "401": errorResponse },
      },
      get: {
        tags: ["Authentication"],
        summary: "Better Auth read endpoint",
        description: "Documents the GET form of Better Auth's catch-all route.",
        responses: { "200": { description: "Better Auth response", content: { "application/json": { schema: { type: "object", additionalProperties: true } } } }, "401": errorResponse },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "session token" },
    },
    parameters: {
      Id: { name: "id", in: "path", required: true, description: "Resource UUID", schema: { type: "string", format: "uuid" } },
    },
    schemas: {
      Error: { type: "object", required: ["error"], properties: { error: { type: "string" } } },
      Health: { type: "object", required: ["status"], properties: { status: { type: "string", example: "ok" } } },
      MeResponse: { type: "object", required: ["user"], properties: { user: { type: "object", additionalProperties: true } } },
      UserResponse: { type: "object", required: ["user"], properties: { user: { type: "object", additionalProperties: true } } },
      CreatedUserResponse: { type: "object", required: ["user", "tempPassword"], properties: { user: { type: "object", additionalProperties: true }, tempPassword: { type: "string" } } },
      SetNewPasswordRequest: { type: "object", required: ["current_password", "new_password", "confirm_new_password"], properties: { current_password: { type: "string", format: "password" }, new_password: { type: "string", format: "password" }, confirm_new_password: { type: "string", format: "password" } } },
      CreateInstitutionRequest: { type: "object", required: ["instData", "adminData"], properties: { instData: { $ref: "#/components/schemas/InstitutionInput" }, adminData: { $ref: "#/components/schemas/AdminRequest" } } },
      InstitutionInput: { type: "object", required: ["code", "name"], properties: { code: { type: "string", maxLength: 20 }, name: { type: "string" }, address: { type: "string" }, contact_phone: { type: "string" }, contact_email: { type: "string", format: "email" } } },
      UpdateInstitutionRequest: { allOf: [{ $ref: "#/components/schemas/InstitutionInput" }], description: "Any subset of institution fields may be supplied." },
      AdminRequest: { type: "object", required: ["phoneNumber"], properties: { phoneNumber: { type: "string" }, name: { type: "string" }, email: { type: "string", format: "email" } } },
      CreateAdminRequest: { type: "object", required: ["instId", "phoneNumber"], properties: { instId: { type: "string", format: "uuid" }, phoneNumber: { type: "string" } } },
      UpdateAdminRequest: { type: "object", required: ["instId"], properties: { instId: { type: "string", format: "uuid" }, name: { type: "string" }, email: { type: "string", format: "email" } } },
      ScopedRequest: { type: "object", required: ["instId"], properties: { instId: { type: "string", format: "uuid" } } },
      CreateUserRequest: { type: "object", required: ["phoneNumber", "role"], properties: { phoneNumber: { type: "string" }, email: { type: "string", format: "email" }, role: { type: "string", enum: ["ADMIN"] }, name: { type: "string" } } },
      UpdateUserRequest: { type: "object", properties: { name: { type: "string" }, email: { type: "string", format: "email" } } },
    },
  },
} as const;