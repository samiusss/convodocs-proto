import type { Metadata } from 'next'
import ThemeRegistry from './ThemeRegistry'
import './globals.css'

export const metadata: Metadata = {
  title: 'ConvoDocs',
  description: 'Document management system',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
