import type { Metadata } from 'next'
import { SiteScripts } from '@/components/SiteScripts'

export const metadata: Metadata = {
  title: 'Jerome Fisher M&T Innovation Fund',
  description:
    'Seed-stage cash grants and venture deployment for University of Pennsylvania startups.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="cache-control" content="max-age=0" />
        <meta httpEquiv="expires" content="0" />
        <meta httpEquiv="pragma" content="no-cache" />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/grayscale.css" rel="stylesheet" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/jquery.bootstrapvalidator/0.5.3/css/bootstrapValidator.min.css"
          rel="stylesheet"
        />
        <link href="/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <link
          href="https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,700"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body id="page-top" data-spy="scroll" data-target=".navbar-fixed-top">
        {children}
        <SiteScripts />
      </body>
    </html>
  )
}
