/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
      },
    ],
  },
  // sharp ships native (.node) binaries that must not be bundled by
  // webpack/Turbopack — marking it external keeps the real binary reachable
  // at runtime instead of erroring when the image upload route calls it.
  serverExternalPackages: ['@neondatabase/serverless', 'sharp'],
}

export default nextConfig
