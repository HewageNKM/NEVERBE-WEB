/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/shop',
                permanent: true,
            },
        ];
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images:{
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/*/**',
            },
        ],
    }
};

export default nextConfig;
