/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_COMMENTS_DB_URL: "http://golsim.live:5984/comments_dev/",
  },
};

module.exports = nextConfig;
