'use client'

import { useState, useEffect } from 'react'
import { Trophy, Calendar, CalendarDays, TrendingUp, MapPin, User as UserIcon, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Profile } from '@/app/types/profile'
import { motion } from "framer-motion";
import { useSupabase } from "../providers";
import { User } from "@supabase/supabase-js";

export default function DashboardPage() {
const COLORS = {
primary: "#170647",
secondary: "#A48AFF",
accent: "#E879F9", // rose vif
background: "bg-gradient-to-br from-purple-50 via-white to-pink-50"
};

const router = useRouter()	

const {supabase} = useSupabase()
const [user, setUser] = useState<User | null >(null)
const [profile, setProfile] = useState<Profile | null>(null);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
const [profileLoading, setProfileLoading] = useState(true); // loading flag

// Récupération de l'utilisateur pour savoir si on le garde connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          console.warn("Aucun utilisateur valide, redirection vers /login");
        //   router.replace("/login");
          return;
        }

        setUser(data.user);
		setProfileLoading(false)
        console.log("Utilisateur connecté :", data.user);
      } catch (err) {
        console.error("Erreur récupération user :", err);
        // router.replace("/login");
      }
    };

    fetchUser();
  }, [router, supabase]);

// Récupération des données de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return  // ne fait rien si pas de user
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq('iduser', user?.id)
        .maybeSingle();
      if (!error && data) {
        setProfile(data);
      } else {
        console.error("Erreur lors de la récupération du profil de l'utilisateur:", error);
      }

      setProfileLoading(false); // fin du chargement
    };
    
    fetchUser();

  }, [user]);

// useEffect(() => {
// 	const loadStats = async () => {
// 		try {
// 		const response = await fetch('/api/stats', {
// 			headers: {
// 			'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
// 			}
// 		})
// 		const data = await response.json()
// 		setStats(data)
// 		} catch (error) {
// 		console.error('Error loading stats:', error)
// 		}
// 	};
// 	loadStats()
// }, [user])

console.log(profileLoading)

if (profileLoading) {
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
				{/* <Card>
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
				</Card> */}
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
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

				{/* <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/scheduling')}>
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
				</Card> */}
			</div>
		</main>
	</div>
)
}