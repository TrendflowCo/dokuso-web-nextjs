/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.producthunt.com'
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org'
      },
      {
        protocol: 'https',
        hostname: 'seeklogo.com'
      },
      {
        protocol: 'https',
        hostname: 'pacificplace.com.hk'
      },
      {
        protocol: 'https',
        hostname: 'torrado.es'
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      },
      {
        protocol: 'https',
        hostname: 'logodownload.org'
      },
      {
        protocol: 'https',
        hostname: 'logos-download.com'
      },
      {
        protocol: 'https',
        hostname: 'fashionunited.com'
      },
    ]
  }
}

module.exports = nextConfig
