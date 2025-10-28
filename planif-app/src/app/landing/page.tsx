"use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
import { CalendarDays, BarChart3, Users, Trophy } from "lucide-react";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/supabase';
import type { User } from '@supabase/supabase-js'
import { Calendar, MapPin, TrendingUp, LogIn, UserPlus, Menu, X, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const handleSelectPlan = (plan: "monthly" | "yearly") => {
    router.push(`/signup?plan=${plan}`);
  };

const router = useRouter()
const [user, setUser] = useState<User | null>(null);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

useEffect(() => {
	checkUser()
}, [])

const checkUser = async () => {
	const { data: { user } } = await supabase.auth.getUser()
	if (user) {
	router.push('/dashboard')
	}
	setUser(user)
}

return (
	<div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
	  {/* Navigation */}
	  <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
		<div className="container mx-auto px-4 py-4">
		  <div className="flex items-center justify-between">
			<div className="flex items-center space-x-2">
			  <div className="bg-gradient-to-br from-[#170647] to-purple-600 p-2 rounded-xl">
				<Trophy className="h-6 w-6 text-white" />
			  </div>
			  <span className="text-2xl font-bold bg-gradient-to-r from-[#170647] to-purple-600 bg-clip-text text-transparent">SmashUp</span>
			</div>
			
			{/* Desktop Menu */}
			<div className="hidden md:flex items-center space-x-4">
				<Link href="/login">
					<Button variant="ghost" className="text-gray-700 hover:text-[#170647]">
					<LogIn className="h-4 w-4 mr-2" />
					Connexion
					</Button>
				</Link>
				<Link href="/signup?demo=true">
					<Button className="bg-gradient-to-r from-[#170647] to-purple-600 hover:opacity-90 shadow-lg shadow-purple-500/30">
						<Sparkles className="h-4 w-4 mr-2" />
						Essayer gratuitement pendant 1 mois
					</Button>
				</Link>
			</div>


			{/* Mobile Menu Button */}
			<button
			  className="md:hidden"
			  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
			>
			  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
			</button>
		  </div>

		  {/* Mobile Menu */}
		  {mobileMenuOpen && (
			<div className="md:hidden mt-4 space-y-2">
			  <Link href="/login">
				<Button variant="ghost" className="w-full">
				  <LogIn className="h-4 w-4 mr-2" />
				  Connexion
				</Button>
			  </Link>
			  <Link href="/signup?demo=true">
				<Button className="w-full bg-gradient-to-r from-[#170647] to-purple-600">
				  <UserPlus className="h-4 w-4 mr-2" />
				 	Essayer gratuitement pendant 1 mois
				</Button>
			  </Link>
			</div>
		  )}
		</div>
	  </nav>

	  {/* Hero Section */}
		<section className="container mx-auto px-4 py-10 text-center">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
					Planifiez vos tournois de tennis
					<span className="block bg-gradient-to-r from-[#170647] via-purple-600 to-pink-600 bg-clip-text text-transparent">en toute simplicité</span>
				</h1>
				<p className="text-xl text-gray-600 mb-8 leading-relaxed">
					Trouvez les tournois qui correspondent à votre niveau, votre localisation et vos disponibilités.
					Optimisez votre calendrier tennistique avec notre algorithme intelligent.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link href="/signup?demo=true">
					<Button size="lg" className="bg-gradient-to-r from-[#170647] to-purple-600 hover:opacity-90 text-xl px-8 shadow-xl shadow-purple-500/30">
						<Sparkles className="h-5 w-5 mr-2" />
						Essayer gratuitement pendant 1 mois
					</Button>
					</Link>
					<Link href="/login">
					<Button size="lg" variant="outline" className="text-xl px-8 border-2 border-[#170647] text-[#170647] hover:bg-purple-50">
						Se connecter
					</Button>
					</Link>
				</div>
			</div>
		</section>

	  {/* Features Section */}
	  <section className="container mx-auto px-4 py-5">
		<div className="text-center mb-12">
		  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
			Tout ce dont vous avez besoin
		  </h2>
		  <p className="text-lg text-gray-600">
			Des outils puissants pour gérer votre carrière tennistique
		  </p>
		</div>

		<div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-8 max-w-5xl mx-auto mt-12">
		  <Card className="border-2 hover:border-[#170647] hover:shadow-xl transition-all duration-300 group">
			<CardHeader>
			  <div className="w-14 h-14 bg-gradient-to-br from-[#170647] to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
				<Calendar className="h-7 w-7 text-white" />
			  </div>
			  <CardTitle>Planification intelligente</CardTitle>
			</CardHeader>
			<CardContent>
			  <CardDescription>
				Algorithme de recommandation basé sur vos critères : dates, distance, niveau de jeu
			  </CardDescription>
			</CardContent>
		  </Card>

		  <Card className="border-2 hover:border-[#170647] hover:shadow-xl transition-all duration-300 group">
			<CardHeader>
			  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
				<MapPin className="h-7 w-7 text-white" />
			  </div>
			  <CardTitle>Distance automatique</CardTitle>
			</CardHeader>
			<CardContent>
			  <CardDescription>
				Calcul des distances entre votre domicile et les tournois pour optimiser vos déplacements
			  </CardDescription>
			</CardContent>
		  </Card>

		  <Card className="border-2 hover:border-[#170647] hover:shadow-xl transition-all duration-300 group">
			<CardHeader>
			  <div className="w-14 h-14 bg-gradient-to-br from-[#170647] to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
				<Trophy className="h-7 w-7 text-white" />
			  </div>
			  <CardTitle>Base de tournois</CardTitle>
			</CardHeader>
			<CardContent>
			  <CardDescription>
				Accédez à tous les tournois avec dates, surfaces, dotations et classifications
			  </CardDescription>
			</CardContent>
		  </Card>

		  <Card className="border-2 hover:border-[#170647] hover:shadow-xl transition-all duration-300 group">
			<CardHeader>
			  <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
				<TrendingUp className="h-7 w-7 text-white" />
			  </div>
			  <CardTitle>Analyse de performance</CardTitle>
			</CardHeader>
			<CardContent>
			  <CardDescription>
				Suivez vos matches, statistiques et KPIs pour améliorer votre jeu
			  </CardDescription>
			</CardContent>
		  </Card>
		</div>
		<div className="max-w-4xl mx-auto text-center">
			<h3 className="text-xl mt-12 font-bold text-gray-900">Gagnez du temps, concentrez-vous sur le jeu</h3>
			<div className="flex flex-col sm:flex-row gap-6 justify-center mt-4">
				{/* Option mensuelle */}
				<div
					className="cursor-pointer p-6 sm:p-8 rounded-2xl border-4 border-purple-300 
							bg-gradient-to-br from-white via-purple-50 to-purple-100 
							hover:from-purple-100 hover:via-purple-50 hover:to-white 
							transition-all duration-500 shadow-sm hover:shadow-md hover:scale-[1.02]
							animate-gradientMove"
					onClick={() => handleSelectPlan("monthly")}
				>
					<p className="text-gray-800 font-semibold text-2xl text-center">2€/mois</p>
					<p className="text-gray-500 text-sm text-center mt-1">
					Sans engagement
					</p>
				</div>

				{/* Option annuelle */}
				<div
					className="cursor-pointer p-6 sm:p-8 rounded-2xl border-4 border-purple-300 
							bg-gradient-to-br from-white via-purple-50 to-purple-100 
							hover:from-purple-100 hover:via-purple-50 hover:to-white 
							transition-all duration-500 shadow-sm hover:shadow-md hover:scale-[1.02]
							animate-gradientMove"
					onClick={() => handleSelectPlan("yearly")}
				>
					<p className="text-gray-800 font-semibold text-2xl text-center">20€/an</p>
					<p className="text-green-600 font-semibold text-sm text-center mt-1">
					-20% par rapport <br/>
					au mensuel !
					</p>
				</div>
			</div>
		</div>
	  </section>

	  {/* CTA Section */}
	  <section className="relative overflow-hidden">
		<div className="absolute inset-0 bg-gradient-to-r from-[#170647] via-purple-700 to-purple-900 opacity-95"></div>
		<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3djE0aC03eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
		
		<div className="relative container mx-auto px-4 py-20 text-center">
		  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
			Prêt à optimiser votre carrière tennistique ?
		  </h2>
		  <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
			Rejoignez des centaines de joueurs qui planifient leurs tournois intelligemment
		  </p>
		  <Link href="/signup">
			<Button size="lg" className="bg-white text-[#170647] hover:bg-gray-100 text-lg px-8 shadow-2xl">
			  <Sparkles className="h-5 w-5 mr-2" />
			  Essayer gratuitement pendant 1 mois
			</Button>
		  </Link>
		</div>
	  </section>

	  {/* Footer */}
	  <footer className="bg-gray-900 text-white py-12">
		<div className="container mx-auto px-4">
		  <div className="flex flex-col items-center text-center space-y-4">
			<div className="flex items-center space-x-2">
			  <div className="bg-gradient-to-br from-[#170647] to-purple-600 p-2 rounded-xl">
				<Trophy className="h-5 w-5 text-white" />
			  </div>
			  <span className="text-lg font-semibold">SmashUp</span>
			</div>
			<p className="text-gray-400">© 2025 SmashUp. Tous droits réservés.</p>
			<p className="text-sm text-gray-500">Développé avec 💜 pour les joueurs de tennis</p>
		  </div>
		</div>
	  </footer>
	</div>
  )

}
