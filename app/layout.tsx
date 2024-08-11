import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Father Translator',
  description: 'Translate text using AI',
  icons: {
    icon: '/fathertranslator.png',
    apple: '/fathertranslator.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-black dark:text-white`}>{children}</body>
    </html>
  )
}