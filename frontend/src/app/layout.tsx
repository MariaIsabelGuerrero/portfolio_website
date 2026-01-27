import React from "react"
import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Open_Sans, Radio_Canada } from 'next/font/google'

// Initialize fonts
const openSans = Open_Sans({ 
  subsets: ['latin'], 
  weight: ["300","400","500","600","700","800"],
  variable: '--font-sans'
})
const radioCanada = Radio_Canada({ 
  subsets: ['latin'], 
  weight: ["300","400","500","600","700"],
  variable: '--font-display'
})

export const metadata: Metadata = {
  title: 'Maria Isabel Guerrero | Front-End Developer',
  description: 'Front-End developer specializing in building single page web applications',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${radioCanada.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
