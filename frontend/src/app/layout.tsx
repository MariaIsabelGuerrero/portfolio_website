import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from '@/components/Providers';
import { getProfile } from '@/lib/public-api';

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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await getProfile();

    const title =
      data.metaTitle ||
      (data.fullName ? `${data.fullName} | Portfolio` : 'Portfolio');
    const description = data.metaDescription || data.bio_en || 'Portfolio';
    const siteUrl = data.siteUrl || undefined;
    const image = data.profileImage || undefined;

    return {
      title,
      description,
      metadataBase: siteUrl ? new URL(siteUrl) : undefined,
      openGraph: {
        title,
        description,
        url: siteUrl,
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: 'Portfolio', description: 'Portfolio' };
  }
}

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
