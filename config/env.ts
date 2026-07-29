const env = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || "HS256",

  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  ACCESS_COOKIE_NAME: process.env.ACCESS_COOKIE_NAME || "freeai_access_token",
  REFRESH_COOKIE_NAME: process.env.REFRESH_COOKIE_NAME || "freeai_refresh_token",

  ACCESS_COOKIE_MAX_AGE: parseInt(process.env.ACCESS_COOKIE_MAX_AGE || "3600", 10),
  REFRESH_COOKIE_MAX_AGE: parseInt(process.env.REFRESH_COOKIE_MAX_AGE || "604800", 10),

  COOKIE_SECURE: process.env.COOKIE_SECURE === "true",
  COOKIE_HTTP_ONLY: process.env.COOKIE_HTTP_ONLY !== "false",
  COOKIE_SAME_SITE: (process.env.COOKIE_SAME_SITE || "lax") as "lax" | "strict" | "none",

  MIMO_API_KEY: process.env.MIMO_API_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
}

export default env
