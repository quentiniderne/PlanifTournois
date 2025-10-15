"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, BarChart3, Users, Trophy } from "lucide-react";

export default function LandingPage() {
const features = [
	{
	title: "Programmation intelligente",
	description:
		"Planifie automatiquement tes tournois FFT et ITF selon ton niveau, tes disponibilités et tes objectifs de progression.",
	icon: <CalendarDays className="w-10 h-10 text-[#A48AFF]" />,
	},
	{
	title: "Analyse de performance",
	description:
		"Suis ton ratio victoires/défaites, tes surfaces préférées et visualise ta progression en temps réel.",
	icon: <BarChart3 className="w-10 h-10 text-[#A48AFF]" />,
	},
	{
	title: "Communauté de joueurs",
	description:
		"Connecte-toi avec d’autres compétiteurs, partage tes résultats et découvre les parcours des joueurs autour de toi.",
	icon: <Users className="w-10 h-10 text-[#A48AFF]" />,
	},
	{
	title: "Objectifs et saison",
	description:
		"Définis ta saison, fixe tes objectifs et laisse SmashUp t’aider à les atteindre tournoi après tournoi.",
	icon: <Trophy className="w-10 h-10 text-[#A48AFF]" />,
	},
];

return (
	<main className="min-h-screen w-full bg-white text-white flex flex-col items-center px-6 py-16 overflow-x-hidden">
	{/* Hero Section */}
	<motion.section
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.8 }}
		className="text-center max-w-3xl mb-20"
	>
		<h1 className="text-5xl font-bold mb-6">
			🎾<span className="text-[#170647]">Bienvenue sur </span><span className="text-[#A48AFF]">SmashUp</span>
		</h1>
		<p className="text-lg text-[#170647]/80 mb-10 leading-relaxed">
			Gérez vos programmations de tournois facilement, avec un outil pensé pour les joueurs et clubs.
		</p>

		<div className="flex justify-center space-x-6">
			<Link
				href="/signup"
				className="bg-[#170647]/90 text-white hover:bg-[#170647] px-8 py-3 rounded-xl font-semibold shadow-md transition"
			>
				S’inscrire
			</Link>
			<Link
				href="/login"
				className="border border-[#A48AFF] hover:bg-[#A48AFF]/40 px-8 py-3 rounded-xl font-semibold text-[#170647] transition"
			>
				Se connecter
			</Link>
		</div>
	</motion.section>

	{/* Features Section */}
	<motion.section
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ delay: 0.5, duration: 1 }}
		className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl"
	>
		{features.map((feature, index) => (
			<motion.div
				key={index}
				whileHover={{ scale: 1.05 }}
				className="bg-[#170647]/90 hover:bg-[#170647] backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg transition"
			>
				<div className="flex items-center mb-4">
				{feature.icon}
				<h3 className="text-2xl font-semibold ml-3">{feature.title}</h3>
				</div>
				<p className="text-white/80">{feature.description}</p>
			</motion.div>
		))}
	</motion.section>

	{/* Footer */}
	<footer className="mt-20 text-center text-black text-sm">
		© {new Date().getFullYear()} SmashUp — Tous droits réservés.
	</footer>
	</main>
);
}
