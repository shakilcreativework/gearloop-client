import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/theme/ThemeProvider";
import PaddleProvider from "@/components/booking/PaddleProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GearLoop — Rent & Lend Outdoor Gear",
  description:
    "A peer-to-peer marketplace where people rent out their outdoor & adventure gear to others nearby.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme')||'system';var r=t==='system'?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):t;document.documentElement.classList.toggle('dark',r==='dark');document.documentElement.style.colorScheme=r}catch(e){}})()`}
        </Script>
        <ThemeProvider>
          <PaddleProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </PaddleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
