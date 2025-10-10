"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");

  const tabs = [
    { id: "programmations", label: "Tournois", href: "/tournoisList" },
    { id: "historique", label: "Mes programmations", href: "/mes-programmations" },
    { id: "joueurs", label: "Joueurs", href: "/joueurs" },
    { id: "stats", label: "Analyse", href: "/stats" },
  ];

  const isProfileActive = pathname === "/profil";

  return (
    <header className="flex justify-between bg-[#170647] items-center p-6 border-b border-white/20">
      {/* Logo */}
      <Link href="/home" className="flex items-center" onClick={() => setActiveTab("")}>
        <Image src="/logo.png" alt="Logo SmashUp" width={150} height={150} />
      </Link>

      {/* Navigation Tabs */}
      <nav className="bg-[#170647] border-b border-white/20">
        <ul className="flex space-x-6 p-4">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <Link
                href={tab.href}
                className={`pb-1 text-2xl ${
                  activeTab === tab.id
                    ? "border-b-2 border-white font-semibold text-white"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bouton Profil */}
      <div className="flex items-center space-x-4">
        <Link href="/profil" onClick={() => setActiveTab("")}>
          <div
            className={`p-2 rounded-full border-2 transition-all duration-200 ${
              isProfileActive ? "border-white" : "border-transparent"
            }`}
          >
            <User className="w-10 h-10 text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}
