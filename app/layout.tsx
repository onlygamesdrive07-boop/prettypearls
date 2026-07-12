import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import { ToastProvider } from "@/components/Toast";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pretty Pearls — Handcrafted Bracelets & Keychains",
  description:
    "Every bead, every flower, every knot — handmade with care. Discover the atelier's collection of handcrafted bracelets and keychains.",
  openGraph: {
    title: "Pretty Pearls — Handcrafted Stories You Can Carry",
    description:
      "A gallery of handmade bracelets and keychains, woven bead by bead.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          <ToastProvider>{children}</ToastProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
