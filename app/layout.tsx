import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import SessionProvider from "../components/SessionProvider";
import NetworkStatusAlert from "../components/NetworkStatusAlert";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaizNation",
  description: "Official portfolio of FaizNation. Explore my projects and connect with me.",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden flex flex-col`}
      >
        <SessionProvider>
          <ClientLayout>
            <Navbar />
            <main className="bg-white dark:bg-black flex-1 flex flex-col items-center justify-center pt-16">
              {children}
            </main>
            <Footer />
            <ChatWidget />
            <NetworkStatusAlert />
          </ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
