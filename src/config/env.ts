import { z } from "zod";
import "dotenv/config";
 
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(16),
  BETTER_AUTH_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
});
 
const parsed = envSchema.safeParse(process.env);
 
if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}
 
export const env = parsed.data;
