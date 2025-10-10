"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  // Données en dur pour les tournois à venir
  const tournois = [
    {
      nom: "Tournoi Open Lyon",
      date: "12-15 Oct 2025",
      lieu: "Lyon",
      type: "Senior",
    },
    {
      nom: "Tournoi Jeunes Paris",
      date: "20-22 Oct 2025",
      lieu: "Paris",
      type: "Junior",
    },
    {
      nom: "Tournoi ITF Marseille",
      date: "25-28 Oct 2025",
      lieu: "Marseille",
      type: "Senior",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-white flex flex-col">
      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#170647]">Bienvenue sur SmashUp</h1>
        <p className="mb-8 text-gray-700">Gérez vos programmations de tournois facilement.</p>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Nouvelle programmation */}
          <Link href="/tournoisList">
            <div className="bg-[#170647] text-white rounded-lg p-6 cursor-pointer 
                transform transition duration-200 
                hover:scale-105 hover:shadow-xl">
              <h2 className="text-xl font-semibold mb-2">Liste des tournois</h2>
              <p>Accédez à la liste des tournois pour créer une programmation.</p>
            </div>
          </Link>

          {/* Mes programmations */}
          <Link href="/mes-programmations">
            <div className="bg-[#170647] text-white rounded-lg p-6 cursor-pointer 
                transform transition duration-200 
                hover:scale-105 hover:shadow-xl">
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

        {/* Tournois à venir */}
        <div className="mb-8">
          	<h2 className="text-2xl font-bold text-[#170647] mb-4">Programmations à venir</h2>
          	<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{tournois.map((t, idx) => (
				<div
					key={idx}
					className="bg-gray-100 text-[#170647] rounded-lg shadow p-4 flex flex-col border-2 border-transparent 
							transition duration-200 hover:border-[#170647] hover:shadow-md hover:-translate-y-1"
				>
					<span className="font-semibold text-lg">{t.nom}</span>
					<span className="text-gray-500 text-sm">{t.date}</span>
					<span className="text-gray-500 text-sm">{t.lieu} - {t.type}</span>
				</div>
				))}
			</div>
        </div>

      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-white/20 text-gray-500">
        &copy; {new Date().getFullYear()} SmashUp. Tous droits réservés.
      </footer>
    </div>
  );
}
