"use client";

import MainLayout from '@/app/components/MainLayout';
import { Button } from "@/components/ui/button";
import { supabase } from '@/app/lib/supabase';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { ExternalLink } from "lucide-react";

export default function Home() {
	const [tournois, setTournois] = useState<any[]>([])
	const [categorie, setCategorie] = useState<string>('all')
	const [dotationMin, setDotationMin] = useState<string>('')
	const [surface, setSurface] = useState<'all' | 'dur' | 'terre' | 'gazon'>('all')
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

	useEffect(() => {
		async function fetchData() {
			const query = supabase.from('tournois').select('*')

			if (categorie === 'senior') query.eq('Senior', 1)
			else if (categorie === 'junior') query.eq('Junior', 1)

			if (dotationMin !== '' && !isNaN(Number(dotationMin))) {
				query.gte('dotation', Number(dotationMin))
			}

			const { data, error } = await query
			if (!error && data) setTournois(data)
			else console.error('Erreur Supabase :', error?.message)
		}
		fetchData()
	}, [categorie, dotationMin])

	// --- Tri dynamique ---
	const handleSort = (key: string) => {
		let direction: 'asc' | 'desc' = 'asc'
		// Si on reclique sur la même colonne, on inverse
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
		direction = 'desc'
		}
		// 👇 Cas spécial : si on clique pour la première fois sur "dotation", on commence par desc
		else if (!sortConfig && key === 'dotation') {
		direction = 'desc'
		}
		setSortConfig({ key, direction })
	} 

	const sortedTournois = [...tournois].sort((a, b) => {
		if (!sortConfig) return 0
		const { key, direction } = sortConfig
		const order = direction === 'asc' ? 1 : -1

		const aVal = a[key] ?? ''
		const bVal = b[key] ?? ''

		if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * order
		return String(aVal).localeCompare(String(bVal)) * order
	})

	const renderArrow = (key: string) => {
		if (sortConfig?.key !== key) return '↕️'
		return sortConfig.direction === 'asc' ? '▲' : '▼'
	}

	return (
		<MainLayout>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-bold">Liste des tournois</h2>
				<Link href="/creaProg">
					<Button className="bg-[#170647] text-white px-4 py-2 rounded-lg hover:bg-[#2a1085] transition-colors">
						+ Créer une programmation
					</Button>
				</Link>
			</div>

			<div className="mb-4 flex gap-4">
				<input
					type="text"
					placeholder="Rechercher un tournoi..."
					className="border border-gray-300 rounded px-3 py-2 w-1/3"
				/>
				<select className="border text-black border-gray-300 rounded px-3 py-2">
					<option value="all">Surface</option>
					<option value="dur">Dur</option>
					<option value="terre">Terre</option>
					<option value="gazon">Gazon</option>
				</select>
				<input
					type="number"
					placeholder="Dotation minimale (€)"
					className="border border-gray-300 rounded px-3 py-2 w-1/5 text-black"
					value={dotationMin}
					onChange={(e) => setDotationMin(e.target.value)}
				/>
				<select
					className="border text-black border-gray-300 rounded px-3 py-2"
					value={categorie}
					onChange={(e) => setCategorie(e.target.value as 'all' | 'senior' | 'junior')}
				>
					<option value="all">Catégories</option>
					<option value="senior">Senior</option>
					<option value="junior">Junior</option>
				</select>
			</div>

			<table className="w-full bg-white text-black shadow rounded-lg overflow-hidden">
				<thead className="bg-gray-100 text-left text-sm text-black">
					<tr>
						<th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('libtournoi')}>
							Nom {renderArrow('libtournoi')}
						</th>
						<th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('datdeb')}>
							Date début {renderArrow('datdeb')}
						</th>
						<th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('datfin')}>
							Date fin {renderArrow('datfin')}
						</th>
						<th className="px-4 py-2 cursor-pointer">
							Classement
						</th>
						<th className="px-4 py-2 cursor-pointer">
							Surface
						</th>
						<th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('dotation')}>
							Dotation {renderArrow('dotation')}
						</th>
						<th className="px-4 py-2">Lien TenUp</th>
					</tr>
				</thead>
				<tbody className="text-sm">
					{sortedTournois
						.filter((t) => {
							if (categorie === 'senior') return t?.Senior === true
							if (categorie === 'junior') return t?.Junior === true
							return true
						})
						.map((t) => (
							<tr key={t?.idtournoi} className="hover:bg-gray-100 border-t">
								<td className="px-4 py-2">{t?.libtournoi}</td>
								<td className="px-4 py-2">{t?.datdeb}</td>
								<td className="px-4 py-2">{t?.datfin}</td>
								<td className="px-4 py-2">{t?.classementSM}</td>
								<td className="px-4 py-2">{t?.surface}</td>
								<td className="px-4 py-2">{t?.dotation} €</td>
								<td className="px-4 py-2">
									<Link
										href={`https://tenup.fft.fr/tournoi/${t?.idtournoi}`}
										target="_blank"
										className="flex items-center text-blue-500 hover:underline"
										rel="noopener noreferrer"
									>
										<ExternalLink className="w-4 h-4 ml-1" />
									</Link>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</MainLayout>
	)
}
