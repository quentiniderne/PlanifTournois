"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("");

  const tabs = [
    { id: "programmations", label: "Programmations", href: "/programmations" },
    { id: "historique", label: "Mes programmations", href: "/mes-programmations" },
    { id: "joueurs", label: "Joueurs", href: "/joueurs" },
    { id: "stats", label: "Analyse", href: "/stats" },
    { id: "profil", label: "Profil", href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-white text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between bg-[#170647] items-center p-6 border-b border-white/20">
        <Link href="/home" className="flex items-center">
          <Image src="/logo.png" alt="Logo SmashUp" width={150} height={150} />
          {/* <span className="ml-3 text-2xl font-bold">SmashUp</span> */}
        </Link>

        {/* Navigation Tabs */}
        <nav className="bg-[#170647] border-b border-white/20">
            <ul className="flex space-x-6 p-4">
            {tabs.map((tab) => (
                <li key={tab.id}>
                <Link
                    href={tab.href}
                    className={`pb-1 ${
                    activeTab === tab.id
                        ? "border-b-2 border-white font-semibold"
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

        <div className="flex items-center space-x-4">
          <span>Bonjour, Utilisateur</span>
          <button className="bg-white text-[#170647] px-4 py-2 rounded hover:bg-gray-200">
            Déconnexion
          </button>
        </div>
      </header>

      

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Bienvenue sur SmashUp</h1>
        <p className="mb-8">Gérez vos programmations de tournois facilement.</p>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nouvelle programmation */}
          <Link href="/tournoisList/globList">
            <div className="bg-[#170647] text-white rounded-lg p-6 hover:shadow-lg cursor-pointer transition">
              <h2 className="text-xl font-semibold mb-2">Liste des tournois</h2>
              <p>Accédez à la liste des tournois.</p>
            </div>
          </Link>

          {/* Nouvelle programmation */}
          <Link href="/programmations">
            <div className="bg-[#170647] text-white rounded-lg p-6 hover:shadow-lg cursor-pointer transition">
              <h2 className="text-xl font-semibold mb-2">Nouvelle programmation</h2>
              <p>Créez rapidement une nouvelle programmation de tournoi.</p>
            </div>
          </Link>

          {/* Mes programmations */}
          <Link href="/mes-programmations">
            <div className="bg-[#170647] text-white rounded-lg p-6 hover:shadow-lg cursor-pointer transition">
              <h2 className="text-xl font-semibold mb-2">Mes programmations</h2>
              <p>Consultez et gérez toutes vos programmations existantes.</p>
            </div>
          </Link>

          {/* Autres fonctionnalités / futures */}
          <div className="bg-[#170647] text-white rounded-lg p-6 opacity-70 cursor-not-allowed">
            <h2 className="text-xl font-semibold mb-2">À venir...</h2>
            <p>De nouvelles fonctionnalités seront bientôt disponibles.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-white/20">
        &copy; {new Date().getFullYear()} SmashUp. Tous droits réservés.
      </footer>
    </div>
  );
}
