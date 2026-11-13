/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        // reactCompiler: true
    },
    trailingSlash: true, //xuất dạng có file index.js trong mỗi thư mục con
};

module.exports = nextConfig;
