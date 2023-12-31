import './globals.css'
import type { Metadata } from 'next'
import Container from './components/container'
import { Analytics } from '@vercel/analytics/react'
import { StrictMode } from 'react'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'ePAUTA',
  description: 'La herramienta con la que salvas el semestre.'
}

export default async function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <StrictMode>
        <body>
          <Container>
            {children}
          </Container>
          <Analytics />
        </body>
      </StrictMode>
    </html>
  )
}
