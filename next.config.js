/** @type {import('next').NextConfig} */

const repoName = 'vacation-home-calculator';
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
