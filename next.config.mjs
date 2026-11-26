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
  // Case study: the Ghorer Bazar redesign lives on a Cloudflare Worker and is
  // served here at /ghorerbazar without changing the address bar.
  async rewrites() {
    const origin = "https://ghorerbazar.dott-redirect.workers.dev"
    return {
      beforeFiles: [
        // Grambangla product page concept: a static page in public/grambangla
        { source: "/grambangla", destination: "/grambangla/index.html" },
        { source: "/grambangla/", destination: "/grambangla/index.html" },
        // Client quotations: /quotation/<slug> is the link we send; the page lives at /order/<slug>
        { source: "/quotation", destination: "/order" },
        { source: "/quotation/:path*", destination: "/order/:path*" },
        { source: "/ghorerbazar", destination: `${origin}/ghorerbazar/` },
        { source: "/ghorerbazar/:path*", destination: `${origin}/ghorerbazar/:path*` },
        { source: "/raaztech", destination: "https://raaztech.dott-redirect.workers.dev/raaztech/" },
        { source: "/raaztech/:path*", destination: "https://raaztech.dott-redirect.workers.dev/raaztech/:path*" },
        { source: "/gw", destination: "https://gw.dott-redirect.workers.dev/gw/" },
        { source: "/gw/:path*", destination: "https://gw.dott-redirect.workers.dev/gw/:path*" },
        { source: "/sslcommerz", destination: "https://sslcommerz.dott-redirect.workers.dev/sslcommerz/" },
        { source: "/sslcommerz/:path*", destination: "https://sslcommerz.dott-redirect.workers.dev/sslcommerz/:path*" },
      ],
    }
  },
}

export default nextConfig
