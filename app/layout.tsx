import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Frecuencia Divina 7 — Siete minutos para volver a ti',
  description: 'Una experiencia de meditación y conexión interior de 30 días, con una práctica guiada de 7 minutos diarios.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080D1D',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
