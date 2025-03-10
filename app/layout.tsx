import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/JsonLd";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CurioPay - AI-Powered Personal Finance Management",
  description:
    "Master your money with CurioPay's AI-powered finance tools. Smart budgeting, expense tracking, and AI-assisted financial planning with LLM integration to help you achieve your financial goals.",
  keywords:
    "personal finance, money management, budgeting, expense tracking, financial planning, AI finance, LLM integration, financial assistant, financial goals, expense analysis",
  authors: [{ name: "CurioPay Team" }],
  creator: "CurioPay",
  publisher: "CurioPay",
  openGraph: {
    title: "CurioPay - AI-Powered Personal Finance Management",
    description: "Master your money with CurioPay's AI-powered finance tools. Smart budgeting, expense tracking, and financial planning.",
    type: "website",
    locale: "en_US",
    url: "https://curiopay.vercel.app",
    siteName: "CurioPay",
    images: [
      {
        url: "https://curiopay.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CurioPay - AI-Powered Personal Finance Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CurioPay - AI-Powered Personal Finance Management",
    description: "Master your money with CurioPay's AI-powered finance tools",
    images: ["https://curiopay.vercel.app/og-image.jpg"],
    creator: "@curiopay",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://curiopay.vercel.app"),
  alternates: {
    languages: {
      'en-US': "/",
    },
  },
  category: "Finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="u8eAN98uGHcSwo0oIRKBS7fKcjcjbRSWwpEVN5wtmRw"
        />
        <link rel="canonical" href="https://curiopay.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans selection:bg-primary/10`}
      >
        <JsonLd />
        <Analytics />
        <SpeedInsights />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
