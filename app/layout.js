import './globals.css'

export const metadata = {
  title: 'Suganthan Arulvelan | Applied AI Architect | Enterprise LLM Solutions',
  description: 'Applied AI Architect designing & shipping production LLM systems — RAG, agentic & multi-agent pipelines, evals at scale. Claude · Gemini · Azure OpenAI. 2M+ documents in production.',
  keywords: ['Applied AI Architect', 'Enterprise LLM', 'RAG', 'Multi-Agent', 'Claude', 'Google Gemini', 'Azure OpenAI', 'Prompt Engineering', 'Evaluation Frameworks', 'Pre-Sales Technical Lead', 'Kubernetes', 'Snowflake'],
  authors: [{ name: 'Suganthan Arulvelan' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Suganthan Arulvelan | Applied AI Architect',
    description: 'Enterprise LLM Solutions & Client Advisory — production RAG, multi-agent pipelines & evals at scale across Claude, Gemini & Azure OpenAI.',
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
      </head>
      <body>{children}</body>
    </html>
  )
}
