import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer,phoneNumber } from "better-auth/plugins";
import { db } from "../db/client.js"; // Dev A's pool + drizzle() instance
 
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
      is_active: { type: "boolean", defaultValue: true },       
      is_archived: { type: "boolean", defaultValue: false },    
      created_by: { type: "string", required: false },         
      updated_by: { type: "string", required: false },       
    },
  },
  plugins: [bearer(),
    phoneNumber({
      // required by the plugin's type even though you won't use OTP sign-up
      sendOTP: async () => {
        throw new Error("OTP flow disabled — accounts are created server-side by admins");
      },
      requireVerification: false,
    }),
  ],
   // lets mobile/API clients send Authorization: Bearer <token>
});
