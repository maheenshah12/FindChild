import type { Metadata } from 'next'
import { Inter, Playfair_Display, Poppins, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FindChildd - Help Find Missing Children',
  description: 'Platform to report and find missing children',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-6">
          <div className="bg-gray-100/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-sm">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <span className="font-space-grotesk font-bold tracking-tight text-2xl text-gray-900">FindChildd</span>
              </Link>
              <div className="flex items-center gap-8">
                <div className="flex gap-8 text-sm font-medium">
                  <Link href="/cases" className="text-gray-700 hover:text-gray-900 transition-colors">Cases</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">Contact</Link>
                </div>
                <Link
                  href="/report"
                  className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Report
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-white pt-16">
          {children}
        </main>
        <footer className="bg-gray-900 py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 mb-16">
              <div className="md:col-span-5">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl">🔍</span>
                  <h3 className="font-bold text-white text-xl">FindChildd</h3>
                </div>
                <p className="text-gray-400 leading-relaxed max-w-md">
                  Connecting communities to help bring missing children home safely through technology and collective action.
                </p>
              </div>

              <div className="md:col-span-3 md:col-start-7">
                <div className="space-y-4">
                  <Link href="/cases" className="block text-white hover:text-gray-300 transition-colors">Explore</Link>
                  <Link href="/cases?status=resolved" className="block text-white hover:text-gray-300 transition-colors">Success Stories</Link>
                  <Link href="/report" className="block text-white hover:text-gray-300 transition-colors">Report</Link>
                  <Link href="/" className="block text-white hover:text-gray-300 transition-colors">About</Link>
                  <Link href="/" className="block text-white hover:text-gray-300 transition-colors">Blog</Link>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="space-y-4">
                  <Link href="/contact" className="block text-white hover:text-gray-300 transition-colors">Contact</Link>
                  <Link href="/" className="block text-white hover:text-gray-300 transition-colors">Help center</Link>
                  <Link href="/" className="block text-white hover:text-gray-300 transition-colors">Volunteer</Link>
                  <Link href="/" className="block text-white hover:text-gray-300 transition-colors">Resources</Link>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-gray-300 transition-colors">X (Twitter)</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-gray-800">
              <div className="text-gray-400 text-sm">
                © FindChildd 2018–2026. All rights reserved
              </div>
              <div className="flex gap-8 text-sm">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Privacy policy</Link>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
