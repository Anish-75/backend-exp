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
    // NOTE: a single {endpoint} path param can't represent Better Auth's
    // real multi-segment routes (e.g. sign-in/phone-number) — Swagger UI
    // URL-encodes the slash as %2F, which the mounted `/api/auth/*` wildcard
    // route does not decode before matching, so "Try it out" 404s even
    // though the underlying route works fine when called directly. The
    // routes actually used by this app are documented explicitly below so
    // they're testable in Swagger UI; the catch-all further down remains
    // only as reference documentation for any other Better Auth route.
    "/api/auth/sign-in/phone-number": {
      post: {
        tags: ["Authentication"],
        summary: "Sign in (all roles — SuperAdmin, InstAdmin, User)",
        description: "Every role signs in identically: phoneNumber + password. The session token is returned in the `set-auth-token` response header, not the JSON body.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SignInRequest" } } },
        },
        responses: {
          "200": {
            description: "Signed in. Copy the token from the set-auth-token response header.",
            content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
          },
          "401": errorResponse,
        },
      },
    },
    "/api/auth/sign-out": {
      post: {
        tags: ["Authentication"],
        summary: "Sign out (revoke current session)",
        security: authenticated,
        responses: {
          "200": { description: "Signed out", content: { "application/json": { schema: { type: "object", additionalProperties: true } } } },
          "401": errorResponse,
        },
      },
    },
    "/api/auth/{endpoint}": {
      parameters: [{ name: "endpoint", in: "path", required: true, description: "Any other Better Auth endpoint. NOT reliably testable via Swagger UI's 'Try it out' for multi-segment values — use curl/Postman instead, or add an explicit path above for routes you test regularly.", schema: { type: "string" } }],
      post: {
        tags: ["Authentication"],
        summary: "Better Auth endpoint (reference only)",
        description: "Better Auth handles session and account operations under this route. Documented for reference; use curl or Postman to actually call multi-segment sub-paths, since Swagger UI cannot represent an unencoded slash inside a single path parameter.",
        requestBody: { required: false, content: { "application/json": { schema: { type: "object", additionalProperties: true } } } },
        responses: { "200": { description: "Better Auth response", content: { "application/json": { schema: { type: "object", additionalProperties: true } } } }, "400": errorResponse, "401": errorResponse },
      },
      get: {
        tags: ["Authentication"],
        summary: "Better Auth read endpoint (reference only)",
        description: "Documents the GET form of Better Auth's catch-all route. Same Swagger UI limitation as the POST form above.",
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
      SignInRequest: { type: "object", required: ["phoneNumber", "password"], properties: { phoneNumber: { type: "string" }, password: { type: "string", format: "password" } } },
      CreateInstitutionRequest: { type: "object", required: ["instData", "adminData"], properties: { instData: { $ref: "#/components/schemas/InstitutionInput" }, adminData: { $ref: "#/components/schemas/AdminRequest" } } },
      InstitutionInput: { type: "object", required: ["code", "name"], properties: { code: { type: "string", maxLength: 20 }, name: { type: "string" }, address: { type: "string" }, phone_number: { type: "string" }, contact_email: { type: "string", format: "email" } } },
      UpdateInstitutionRequest: { type: "object", description: "Any subset of institution fields may be supplied.", properties: { code: { type: "string", maxLength: 20 }, name: { type: "string" }, address: { type: "string" }, phone_number: { type: "string" }, contact_email: { type: "string", format: "email" } } },
      AdminRequest: { type: "object", required: ["phoneNumber"], properties: { phoneNumber: { type: "string" }, name: { type: "string" }, email: { type: "string", format: "email" } } },
      UpdateAdminRequest: { type: "object", required: ["instId"], properties: { instId: { type: "string", format: "uuid" }, name: { type: "string" }, email: { type: "string", format: "email" } } },
      ScopedRequest: { type: "object", required: ["instId"], properties: { instId: { type: "string", format: "uuid" } } },
      CreateUserRequest: { type: "object", required: ["phoneNumber", "role"], properties: { phoneNumber: { type: "string" }, email: { type: "string", format: "email" }, role: { type: "string", enum: ["ADMIN"] }, name: { type: "string" } } },
      UpdateUserRequest: { type: "object", properties: { name: { type: "string" }, email: { type: "string", format: "email" } } },
    },
  },
} as const;