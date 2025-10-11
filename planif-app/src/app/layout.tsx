import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/app/components/HeaderClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmashUp - Programmation de tournois",
  description: "Gérez et suivez vos programmations de tournois de tennis avec SmashUp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900">
        <HeaderClient />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
