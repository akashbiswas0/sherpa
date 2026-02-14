import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { Navbar } from "@/components/shared/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrekMapper — Find Trekking Agencies & Guides",
  description: "Discover and compare verified trekking agencies and local guides across top Himalayan destinations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <ConvexClientProvider>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
