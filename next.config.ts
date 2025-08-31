import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuración para Docker (comentado temporalmente para desarrollo)
  // output: 'standalone', // Comentado para evitar errores de symlinks en Windows

  // Configuración experimental para optimización de CSS
  experimental: {
    // CSS inline para eliminar solicitudes que bloquean el renderizado
    inlineCss: true,
    // Optimización de CSS chunking para reducir el número de archivos CSS
    cssChunking: 'strict',
  },

  // Configuración de imágenes
  images: {
    remotePatterns: [new URL('https://cdn.crystodolarvzla.site/**')],
  },

  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Configuración de rewrites para API
  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://crystodolar-api-production.up.railway.app';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

  // Configuración de variables de entorno
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configuración de webpack
  webpack: (config, { isServer, dev }) => {
    // Configuración específica para el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Optimizaciones para CSS en producción
      if (!dev) {
        // Minimizar CSS
        config.optimization.minimize = true;
        
        // Split chunks para CSS
        config.optimization.splitChunks = {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            styles: {
              name: 'styles',
              test: /\.(css|scss)$/,
              chunks: 'all',
              enforce: true,
            },
          },
        };
      }
    }

    return config;
  },

  // Configuración de compilación
  compiler: {
    // Remover console.log en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuración de TypeScript
  typescript: {
    // Ignorar errores de TypeScript durante el build
    ignoreBuildErrors: false,
  },

  // Configuración de ESLint
  eslint: {
    // Ignorar errores de ESLint durante el build
    ignoreDuringBuilds: false,
  },

  // Configuración de transpilación
  transpilePackages: [],

  // Configuración de base path (útil para subdirectorios)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Configuración de asset prefix
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',

  // Configuración de trailing slash
  trailingSlash: false,

  // Configuración de powered by header
  poweredByHeader: false,

  // Configuración de compress
  compress: true,

  // Configuración de devIndicators
  devIndicators: {
    position: 'bottom-right',
  },

  // Configuración de onDemandEntries
  onDemandEntries: {
    // Período (en ms) donde el servidor mantendrá las páginas en el buffer
    maxInactiveAge: 25 * 1000,
    // Número de páginas que deben mantenerse simultáneamente sin ser desechadas
    pagesBufferLength: 2,
  },

  // Configuración de generateEtags
  generateEtags: true,

  // Configuración de distDir
  distDir: '.next',

  // Configuración de cleanDistDir
  cleanDistDir: true,

  // Configuración de modularizeImports
  modularizeImports: {},

  // Configuración de logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Configuración de pageExtensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Configuración de i18n (internacionalización)
  i18n: undefined,

  // Configuración de reactStrictMode
  reactStrictMode: true,
};

export default nextConfig;
