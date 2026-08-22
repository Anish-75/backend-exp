import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, phoneNumber } from "better-auth/plugins";
import { prisma } from "../db/client.js";
import { env } from "../config/env.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: env.SESSION_TTL_SECONDS,
    updateAge: env.SESSION_UPDATE_AGE_SECONDS,
  },
  user: {
    additionalFields: {
      inst_id: { type: "string", required: true },
      role_id: { type: "string", required: true },
      is_temp_password: { type: "boolean", defaultValue: true },
      is_active: { type: "boolean", defaultValue: true },
      is_archived: { type: "boolean", defaultValue: false },
      created_by: { type: "string", required: false },
      updated_by: { type: "string", required: false },
    },
  },
  plugins: [
    bearer(),
    phoneNumber({
      sendOTP: async () => {
        throw new Error("OTP flow disabled — accounts are created server-side by admins");
      },
      requireVerification: false,
    }),
  ],
});