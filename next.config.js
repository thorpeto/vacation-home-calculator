/** @type {import('next').NextConfig} */

// GitHub Pages deployment configuration
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repoName = 'vacation-home-calculator';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Only add basePath for GitHub Pages
  ...(isGithubActions && {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`
  })
}

module.exports = nextConfig
