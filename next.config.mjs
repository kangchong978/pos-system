/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '6001',
                pathname: '/img/product/**',
            },
        ],
    },
};

export default nextConfig;
