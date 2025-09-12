/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Отключаем source maps для продакшена для уменьшения размера бандла
  productionBrowserSourceMaps: false,
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Эти заголовки необходимы для работы SharedArrayBuffer, который использует ffmpeg.wasm
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
      {
        source: '/ffmpeg/:path*',
        headers: [
          // Устанавливаем правильный MIME-тип для .wasm и долгое кеширование
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      }
    ];
  },

  webpack: (config) => {
    // Решает проблему с модулями Node.js, которые ffmpeg пытается использовать в браузере
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    return config;
  },
};

module.exports = nextConfig;
