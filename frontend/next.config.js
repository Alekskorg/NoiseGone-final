/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  
  // `headers` должна быть функцией верхнего уровня, а не внутри `webpack`
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
      // Этот блок был в неправильном месте, теперь он не нужен, так как Next.js 
      // автоматически обрабатывает файлы в /public с правильными заголовками кеширования.
    ];
  },

  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    return config;
  },
};

module.exports = nextConfig;
