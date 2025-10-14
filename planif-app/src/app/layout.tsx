"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/app/components/HeaderClient";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
const pathname = usePathname();
const hideNavbar = pathname === "/landing" || pathname === "/signup";
return (
	<html lang="fr">
	<body className="bg-gray-50 text-gray-900">
		{!hideNavbar && <Navbar />}
		<HeaderClient />
		<main className="p-6">{children}</main>
	</body>
	</html>
);
}
