import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from "@/components/ui/toaster"
import './globals.css'

export const metadata: Metadata = {
  title: '이지스 - AI 기반 이미지 보호 및 검증 플랫폼',
  description: '원본 이미지를 워터마크로 보호하고 AI 기술로 위변조를 검증하는 종합 이미지 보안 솔루션',
  openGraph: {
    title: '이지스 - AI 기반 이미지 보호 및 검증 플랫폼',
    description: '원본 이미지를 워터마크로 보호하고 AI 기술로 위변조를 검증하는 종합 이미지 보안 솔루션',
    siteName: '이지스 (Aegis)',
    images: [
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
    images: ['/image.png'],
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
