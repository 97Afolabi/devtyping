const scriptSrc =
  process.env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://apis.google.com"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://apis.google.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://www.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.google.com",
  "frame-src https://apis.google.com https://accounts.google.com https://*.firebaseapp.com",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "frame-ancestors 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingRoot: __dirname,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
      ],
    },
  ],
};

module.exports = nextConfig;
