import './globals.css'

export const metadata = {
  title: 'Suganthan Arulvelan | Associate Director | Healthcare Analytics & AI',
  description: 'Associate Director at Syneos Health | Building Healthcare Analytics Platforms | Enterprise Architecture & AI Integration | 1600% User Growth',
  keywords: ['Associate Director', 'Healthcare Analytics', 'Enterprise Architecture', 'AI Integration', 'Azure Kubernetes', 'Snowflake', '.NET Core', 'Svelte'],
  authors: [{ name: 'Suganthan Arulvelan' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Suganthan Arulvelan | Healthcare Analytics & AI',
    description: 'Associate Director at Syneos Health | Building Healthcare Analytics Platforms',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
