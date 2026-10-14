import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spotify-map.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Spotify Map — Live Global Music Map & Real-time Spatial Chat",
    template: "%s | Spotify Map",
  },
  description: "Discover what people are streaming on Spotify right now around the world. Real-time global music map with live spatial chat, Ghost Mode privacy, and instant track previews.",
  keywords: [
    "spotify map",
    "live music map",
    "music discovery",
    "real time spotify listeners",
    "spotify live map",
    "spatial music chat",
    "what is the world listening to",
    "global spotify radar",
    "live listener map",
    "open source maps",
    "music streaming radar",
  ],
  authors: [{ name: "Spotify Map", url: siteUrl }],
  creator: "Spotify Map",
  publisher: "Spotify Map",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Spotify Map — Live Global Music Map & Spatial Chat",
    description: "Discover what people are streaming on Spotify right now around the world. Real-time global music map with spatial chat & Ghost Mode.",
    siteName: "Spotify Map",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotify Map — Live Global Music Map & Spatial Chat",
    description: "Discover what people are streaming on Spotify right now around the world. Real-time global music map with spatial chat & Ghost Mode.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "Music & Audio",
};

export const viewport: Viewport = {
  themeColor: "#05070e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      "name": "Spotify Map",
      "url": siteUrl,
      "applicationCategory": "MusicApplication",
      "operatingSystem": "All",
      "description": "Real-time music discovery map connecting Spotify listeners worldwide with live spatial chat and ghost mode privacy.",
      "featureList": [
        "Live Spotify Playback Sync",
        "Interactive Global Vector Map",
        "Real-time Spatial Chat",
        "Ghost Mode Privacy Protection",
        "30-second Track Previews",
        "Light and Dark Vector Map Themes"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "Spotify Map",
      "description": "Live Global Music Map & Spatial Chat"
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
