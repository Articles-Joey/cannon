/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@articles-media/articles-dev-box'],
    reactCompiler: true,
    // experimental: {
    //     reactCompiler: true,
    // },
    poweredByHeader: false,
    images: {
        // domains: ['cdn.articles.media', 'articles-website.s3.amazonaws.com', 'd3bzp9rk94ifwy.cloudfront.net'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.articles.media',
                port: '',
                // pathname: '',
            },
            {
                protocol: 'https',
                hostname: 'articles-website.s3.amazonaws.com',
                port: '',
                // pathname: '',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self' https://toontown.articles.media;",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
