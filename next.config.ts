import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // `radix-ui` — монопакет, реэкспортирующий все примитивы. В список
    // оптимизируемых по умолчанию он не входит (в отличие от lucide-react),
    // а без этого сборщик разбирает весь barrel ради пяти примитивов.
    optimizePackageImports: ["radix-ui"],
  },
};

export default nextConfig;
