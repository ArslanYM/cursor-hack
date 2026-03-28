import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Fewer lucide chunks; avoids Turbopack "module factory is not available" after edits
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
