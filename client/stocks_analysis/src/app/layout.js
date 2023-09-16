import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import Logo from './icon.ico'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'GrowthIN',
  description: 'A Securities Analysis and Investment Advice Web App',
  icons: {
    icon: Logo,
    shortcut: Logo,
    apple: Logo,
    other: {
      rel: Logo,
      url: Logo,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    // <Provider store={store}>
    <html lang="en">
      
      <body suppressHydrationWarning={true} className={inter.className}>
        {children}
        <Analytics/>
        </body>
    </html>
    //</Provider>
  )
}
