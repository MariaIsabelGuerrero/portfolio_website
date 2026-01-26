import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'Maria Isabel Guerrero | Full-Stack Developer',
  description: 'A Full-Stack developer specializing in building microservices and modern web applications.',
  keywords: ['Full-Stack Developer', 'Java', 'Spring Boot', 'React', 'Microservices', 'Portfolio'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Radio+Canada:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={openSans.className}>{children}</body>
    </html>
  );
}
