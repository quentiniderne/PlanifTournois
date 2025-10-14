"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
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
      <nav className="bg-[#170647] items-center border-b border-white/20">
        {/* Navigation Tabs */}
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
  );
}
