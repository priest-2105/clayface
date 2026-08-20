import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clayface - AI Frontend Compiler",
  description: "Constrained frontend compiler powered by AI",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Clayface',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="hBWF1R-qCgXTzgQ-s650Bd1lv4zKhMqOLge7nkitGSM" />
      </head>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
