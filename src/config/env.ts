import dotenv from "dotenv";
dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",
};

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env file");
}