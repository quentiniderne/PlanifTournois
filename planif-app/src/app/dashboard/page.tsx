'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Trophy, Calendar, CalendarDays, TrendingUp, MapPin, User as UserIcon, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { motion } from "framer-motion";

export default function DashboardPage() {
const COLORS = {
primary: "#170647",
secondary: "#A48AFF",
accent: "#E879F9", // rose vif
background: "bg-gradient-to-br from-purple-50 via-white to-pink-50"
};

const router = useRouter()	
const [user, setUser] = useState<User | null>(null)
interface Profile {
iduser: string
firstname: string
lastname: string
email?: string
}

const [profile, setProfile] = useState<Profile | null>(null)

interface Stats {
	tournamentsScheduled: number
	totalMatches: number
	wins: number
	winRate: number
}

const [stats, setStats] = useState<Stats | null>(null)

const [loading, setLoading] = useState(true)
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

useEffect(() => {
	checkAuth()
	loadStats()
}, [])

const checkAuth = async () => {
	const { data: { user } } = await supabase.auth.getUser()
	
	if (!user) {
	router.push('/login')
	return
	}

	setUser(user)

	// Load profile
	const { data: profileData } = await supabase
	.from('profiles')
	.select('*')
	.eq('iduser', user.id)
	.single()

	setProfile(profileData)
	setLoading(false)
}

const loadStats = async () => {
	try {
	const response = await fetch('/api/stats', {
		headers: {
		'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
		}
	})
	const data = await response.json()
	setStats(data)
	} catch (error) {
	console.error('Error loading stats:', error)
	}
}

const handleLogout = async () => {
	await supabase.auth.signOut()
	router.push('/')
}

if (loading) {
	return (
	<div className="min-h-screen bg-gray-50 flex items-center justify-center">
		<div className="text-center">
		<Trophy className="h-12 w-12 text-[#170647] mx-auto mb-4 animate-pulse" />
		<p className="text-gray-600">Chargement...</p>
		</div>
	</div>
	)
}

return (
	<div className="min-h-screen bg-gray-50">
		{/* Navigation */}
		<nav className="bg-white shadow-sm sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Link href="/dashboard" className="flex items-center space-x-2">
					<Trophy className="h-8 w-8 text-[#170647]" />
					<span className="text-2xl font-bold text-gray-900">SmashUp</span>
					</Link>
					
					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-6">
					<Link href="/dashboard" className="text-gray-700 hover:text-[#170647] font-medium">
						Accueil
					</Link>
					<Link href="/tournaments" className="text-gray-700 hover:text-[#170647] font-medium">
						Tournois
					</Link>
					<Link href="/scheduling" className="text-gray-700 hover:text-[#170647] font-medium">
						Planification
					</Link>
					<Link href="/scheduled" className="text-gray-700 hover:text-[#170647] font-medium">
						Mes tournois
					</Link>
					<Link href="/analysis" className="text-gray-700 hover:text-[#170647] font-medium">
						Analyse
					</Link>
					<Link href="/profile" className="text-gray-700 hover:text-[#170647] font-medium">
						<UserIcon className="h-5 w-5" />
					</Link>
					<Button variant="ghost" size="sm" onClick={handleLogout}>
						<LogOut className="h-4 w-4 mr-2" />
						Déconnexion
					</Button>
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
				<div className="md:hidden mt-4 space-y-2 pb-4">
					<Link href="/dashboard" className="block py-2 text-gray-700 hover:text-[#170647]">
						Accueil
					</Link>
					<Link href="/tournaments" className="block py-2 text-gray-700 hover:text-[#170647]">
						Tournois
					</Link>
					<Link href="/scheduling" className="block py-2 text-gray-700 hover:text-[#170647]">
						Planification
					</Link>
					<Link href="/scheduled" className="block py-2 text-gray-700 hover:text-[#170647]">
						Mes tournois
					</Link>
					<Link href="/analysis" className="block py-2 text-gray-700 hover:text-[#170647]">
						Analyse
					</Link>
					<Link href="/profile" className="block py-2 text-gray-700 hover:text-[#170647]">
						Profil
					</Link>
					<Button variant="ghost" size="sm" onClick={handleLogout} className="w-full">
						<LogOut className="h-4 w-4 mr-2" />
						Déconnexion
					</Button>
				</div>
			)}
			</div>
		</nav>

			<main>
				<div className={`min-h-screen ${COLORS.background} p-8`}>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-[#170647] via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
						Tableau de bord
					</h1>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 200 }}>
							<Card className="border-2 hover:border-[#170647] hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 bg-white/70 backdrop-blur-xl">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-[#170647] to-purple-600 rounded-xl flex items-center justify-center mb-3">
								<CalendarDays className="h-6 w-6 text-white" />
								</div>
								<CardTitle>Prochain tournoi</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>Découvrez les tournois à venir selon votre niveau.</CardDescription>
							</CardContent>
							</Card>
						</motion.div>


						<Card className="border-2 hover:border-pink-600 hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-xl">
						<CardHeader>
							<div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center mb-3">
							<Trophy className="h-6 w-6 text-white" />
							</div>
							<CardTitle>Résultats récents</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>Analysez vos derniers matchs et performances.</CardDescription>
						</CardContent>
						</Card>

						<Card className="border-2 hover:border-indigo-600 hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-xl">
						<CardHeader>
							<div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-3">
							<TrendingUp className="h-6 w-6 text-white" />
							</div>
							<CardTitle>Progression</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>Suivez votre évolution de classement et vos objectifs.</CardDescription>
						</CardContent>
						</Card>
					</div>
				</div>
			</main>

		{/* Main Content */}
		<main className="container mx-auto px-4 py-8">
			{/* Welcome Section */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Bonjour {profile?.firstname} !
				</h1>
				<p className="text-gray-600">
					Bienvenue sur votre tableau de bord SmashUp
				</p>
				</div>

				{/* Stats Cards */}
				<div className="grid md:grid-cols-4 gap-6 mb-8">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-gray-600">
					Tournois planifiés
				</CardTitle>
				<Calendar className="h-4 w-4 text-[#170647]" />
				</CardHeader>
				<CardContent>
				<div className="text-2xl font-bold">{stats?.tournamentsScheduled || 0}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-gray-600">
					Matches joués
				</CardTitle>
				<Trophy className="h-4 w-4 text-[#170647]" />
				</CardHeader>
				<CardContent>
				<div className="text-2xl font-bold">{stats?.totalMatches || 0}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-gray-600">
					Victoires
				</CardTitle>
				<TrendingUp className="h-4 w-4 text-[#170647]" />
				</CardHeader>
				<CardContent>
				<div className="text-2xl font-bold">{stats?.wins || 0}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-gray-600">
					Taux de victoire
				</CardTitle>
				<TrendingUp className="h-4 w-4 text-[#170647]" />
				</CardHeader>
				<CardContent>
				<div className="text-2xl font-bold">{stats?.winRate || 0}%</div>
				</CardContent>
			</Card>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/tournaments')}>
					<CardHeader>
						<Trophy className="h-12 w-12 text-[#170647] mb-2" />
						<CardTitle>Explorer les tournois</CardTitle>
						<CardDescription>
							Découvrez tous les tournois disponibles
						</CardDescription>
					</CardHeader>
				</Card>

				<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/scheduling')}>
					<CardHeader>
						<Calendar className="h-12 w-12 text-[#170647] mb-2" />
						<CardTitle>Planification intelligente</CardTitle>
						<CardDescription>
							Trouvez les tournois adaptés à vos critères
						</CardDescription>
					</CardHeader>
				</Card>

				<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/analysis')}>
					<CardHeader>
						<TrendingUp className="h-12 w-12 text-[#170647] mb-2" />
						<CardTitle>Analyse de performance</CardTitle>
						<CardDescription>
							Suivez vos statistiques et progressez
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</main>
	</div>
)
}