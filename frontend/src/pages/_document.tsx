
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const slogan = "Чистый звук за 10 секунд";

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NoiseGone',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any (Web)',
    description: slogan,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <Html lang="ru">
      <Head>
        {/* ИСПРАВЛЕНО: Добавлена SVG иконка прямо в код, чтобы избежать ошибки 404 */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔊</text></svg>" />
        
        <meta name="description" content={`NoiseGone — ${slogan}. Удалите фоновый шум, эхо и другие помехи из ваших аудио и видео записей прямо в браузере.`} />
        <meta property="og:title" content={`NoiseGone — ${slogan}`} />
        <meta property="og:description" content="Быстрая и безопасная очистка аудио на вашем устройстве с помощью AI." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`NoiseGone — ${slogan}`} />
        <meta name="twitter:description" content="Быстрая и безопасная очистка аудио на вашем устройстве с помощью AI." />
        <meta name="twitter:image" content="/og-image.png" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
