/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    output: "standalone",
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
