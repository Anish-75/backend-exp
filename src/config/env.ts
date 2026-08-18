import dotenv from "dotenv";
dotenv.config();

const required=[
  ' DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
] as const;

for (const key of required){
  if (!process.env[key]){
    throw new Error(`Missing required env variable: ${key}`);
  }
}

export const env={
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV||"development",
  POST: process.env.PORT || "3000",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
} as const;