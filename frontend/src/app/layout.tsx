import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import InstallPrompt from '../components/InstallPrompt';
import OfflineBanner from '../components/OfflineBanner';
import PwaRegister from '../components/PwaRegister';

export const metadata: Metadata = {
  title: 'Krishi Jal | AI-Powered Smart Irrigation System',
  description: 'Predictive Water Management and Crop Optimization PWA for Smallholder Indian Farmers',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Krishi Jal',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#1b4d3e',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 pb-20 md:pb-8 selection:bg-emerald-200">
        <LanguageProvider>
          <OfflineBanner />
          {children}
          <InstallPrompt />
        </LanguageProvider>

        <PwaRegister />
      </body>
    </html>
  );
}
