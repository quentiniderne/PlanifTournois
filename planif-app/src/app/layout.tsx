"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/app/components/HeaderClient";
import { usePathname } from "next/navigation";

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



return (
	<html lang="fr">
		<body className="bg-gray-50 text-gray-900">
			{/* <HeaderClient /> */}
			<main>{children}</main>
		</body>
	</html>
);
}
