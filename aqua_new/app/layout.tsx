import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PunarJal - Smart Wastewater Treatment System",
  description:
    "Intelligent Simulation & Real-Time Monitoring for Sustainable Water Reuse",
  icons: {
    icon: [
      { url: "/assets/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/assets/logo.png",
    apple: [
      { url: "/assets/logo.png", sizes: "180x180", type: "image/png" },
      { url: "/assets/logo.png", sizes: "152x152", type: "image/png" },
      { url: "/assets/logo.png", sizes: "120x120", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/assets/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon", 
        url: "/assets/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
