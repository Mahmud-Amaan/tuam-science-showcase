import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    // Empty config to acknowledge Turbopack usage
    // Most optimizations work out of the box with Turbopack
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
    ],
  },

  // Enable compression
  compress: true,

  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // Power mode for faster builds
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache images for 1 month
        source: "/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|gif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Cache videos
        source: "/(.*)\\.(mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Security headers
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Webpack optimizations (only used when --webpack flag is passed)
  // Turbopack handles code splitting automatically and more efficiently
  webpack: (config, { dev, isServer }) => {
    // Production optimizations for webpack builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunks
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Large libraries get their own chunks
            groq: {
              test: /[\\/]node_modules[\\/](groq-sdk)[\\/]/,
              name: 'groq',
              chunks: 'all',
              priority: 30,
            },
            chart: {
              test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
              name: 'chart',
              chunks: 'async',
              priority: 30,
            },
            p5: {
              test: /[\\/]node_modules[\\/](p5)[\\/]/,
              name: 'p5',
              chunks: 'async',
              priority: 30,
            },
            markdown: {
              test: /[\\/]node_modules[\\/](react-markdown|react-syntax-highlighter)[\\/]/,
              name: 'markdown',
              chunks: 'async',
              priority: 30,
            },
          },
        },
      };
    }
    return config;
  },
};

export default withPWA(nextConfig);
