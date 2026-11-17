/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local photos are served from /public/photos. Remote images are only
    // used for Supabase Storage URLs once Supabase is connected.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Keep uploads small on the server as well as the client.
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },
};

export default nextConfig;
