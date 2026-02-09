import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from '@/components/Providers';

const poppins = localFont({
  src: [
    { path: '../../public/fonts/Poppins-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Poppins-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Poppins-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Poppins-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Poppins-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
