const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  REDIS_URL: z.string().url("REDIS_URL must be a valid URL"),
  AWS_S3_BUCKET: z.string().min(1, "AWS_S3_BUCKET is required"),
  PORT: z.string().default("3000"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.toString());
    console.error("\nApplication boot sequence failed. Exiting...");
    process.exit(1);
  }

  return result.data;
}

module.exports = {
  env: validateEnv()
};
