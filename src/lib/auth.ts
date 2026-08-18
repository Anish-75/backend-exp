import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "../db/index.js"; // Dev A's pool + drizzle() instance
 
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      inst_id: { type: "string", required: true },
      role_id: { type: "string", required: true },
      is_temp_password: { type: "boolean", defaultValue: true },
      status: { type: "string", defaultValue: "ACTIVE" },
    },
  },
  plugins: [bearer()], // lets mobile/API clients send Authorization: Bearer <token>
});
