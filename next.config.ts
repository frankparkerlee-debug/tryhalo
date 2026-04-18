import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old brand-named slugs → SEO-friendly slugs (301 permanent)
      { source: "/renew", destination: "/hormone-therapy", permanent: true },
      { source: "/vital", destination: "/testosterone-therapy", permanent: true },
      { source: "/restore", destination: "/peptide-therapy", permanent: true },
      { source: "/vitality", destination: "/nad-therapy", permanent: true },
      { source: "/vitality-injections", destination: "/vitamin-injections", permanent: true },
    ];
  },
};

export default nextConfig;
