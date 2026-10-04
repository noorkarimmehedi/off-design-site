/** @type {import('next').NextConfig} */
const nextConfig = {
  // harfbuzzjs loads its .wasm from its own folder; bundling it breaks that path
  serverExternalPackages: ["harfbuzzjs"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
