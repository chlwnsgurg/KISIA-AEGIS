import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from "@/components/ui/toaster"
import './globals.css'

export const metadata: Metadata = {
  title: '이지스 - AI 기반 이미지 보호 및 검증 플랫폼',
  description: '원본 이미지를 워터마크로 보호하고 AI 기술로 위변조를 검증하는 종합 이미지 보안 솔루션',
  keywords: ['이미지 보호', '워터마크', 'AI 검증', '위변조 탐지', '이미지 보안', 'AEGIS'],
  authors: [{ name: 'AEGIS Team' }],
  creator: 'AEGIS',
  publisher: 'AEGIS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: '이지스 - AI 기반 이미지 보호 및 검증 플랫폼',
    description: '원본 이미지를 워터마크로 보호하고 AI 기술로 위변조를 검증하는 종합 이미지 보안 솔루션',
    siteName: '이지스 (Aegis)',
    images: [
      {
        url: '/logo.png',
        width: 250,
        height: 250,
        alt: '이지스 로고',
      },
      {
        url: '/image.png',
        width: 1200,
        height: 630,
        alt: '이지스 - 이미지 보호 및 검증 플랫폼',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '이지스 - AI 기반 이미지 보호 및 검증 플랫폼',
    description: '원본 이미지를 워터마크로 보호하고 AI 기술로 위변조를 검증하는 종합 이미지 보안 솔루션',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
