// CRITICAL: Import localStorage polyfill FIRST before any other imports
import "@/lib/polyfills/localStorage";

import type { Metadata } from "next";
import { Inter, DM_Sans, Outfit, Work_Sans } from "next/font/google";
import "./globals.css";

// Using Inter as Google Sans alternative (Google Sans is proprietary)
// Inter has similar geometric characteristics
const inter = Inter({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Layerium Cloud | High-Performance VPS & RDP Hosting",
  description: "Enterprise-grade VPS and RDP hosting with 99.99% uptime, NVMe SSD storage, and global datacenter locations. Deploy your server in seconds.",
  keywords: ["VPS hosting", "RDP hosting", "cloud servers", "virtual private server", "dedicated server"],
  authors: [{ name: "Layerium Cloud" }],
  openGraph: {
    title: "Layerium Cloud | High-Performance VPS & RDP Hosting",
    description: "Enterprise-grade VPS and RDP hosting with 99.99% uptime, NVMe SSD storage, and global datacenter locations.",
    type: "website",
    locale: "en_US",
    siteName: "Layerium Cloud",
  },
  twitter: {
    card: "summary_large_image",
    title: "Layerium Cloud | High-Performance VPS & RDP Hosting",
    description: "Enterprise-grade VPS and RDP hosting with 99.99% uptime, NVMe SSD storage, and global datacenter locations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${dmSans.variable} ${outfit.variable} ${workSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
