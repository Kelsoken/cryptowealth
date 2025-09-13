// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // Experimenteer met deze combinaties:
  trailingSlash: false,      // ← Meestal beter
  assetPrefix: './',         // ← Relative paths
  basePath: '',              // ← Leeg voor root
  
  images: {
    unoptimized: true
  },
  
  // Extra webpack config voor asset paths
  webpack: (config) => {
    config.output.publicPath = '/_next/';
    return config;
  }
}

module.exports = nextConfig