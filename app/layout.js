import './globals.css'

export const metadata = {
  title: 'Suganthan Arulvelan | Associate Director | Healthcare Analytics & AI',
  description: 'Associate Director at Syneos Health | Building Healthcare Analytics Platforms | Enterprise Architecture & AI Integration | 1600% User Growth',
  keywords: ['Associate Director', 'Healthcare Analytics', 'Enterprise Architecture', 'AI Integration', 'Azure Kubernetes', 'Snowflake', '.NET Core', 'Svelte'],
  authors: [{ name: 'Suganthan Arulvelan' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Suganthan Arulvelan | Healthcare Analytics & AI',
    description: 'Associate Director at Syneos Health | Building Healthcare Analytics Platforms',
    type: 'website',
    url: 'https://www.shuganth.com',
  },
  metadataBase: new URL('https://www.shuganth.com'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  )
}
