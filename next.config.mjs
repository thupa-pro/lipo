// import createNextIntlPlugin from "next-intl/plugin";

// const withNextIntl = createNextIntlPlugin("./lib/i18n/config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig; // withNextIntl(nextConfig);
