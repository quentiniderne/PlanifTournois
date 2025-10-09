'use client'

import MainLayout from '@/app/components/MainLayout'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'


export default function Home() {
	const [tournois, setTournois] = useState<Partial<Tournoi[]>>([])
	const [categorie, setCategorie] = useState<string>('all')
	const [dotationMin, setDotationMin] = useState<string>('')
	const [surface, setSurface] = useState<'all' | 'dur' | 'terre' | 'gazon'>('all')


	useEffect(() => {
		async function fetchData() {
			const query = supabase
			.from('x_tournois')
			.select('*')

			if (categorie === 'senior') {
			query.eq('Senior', 1)
			} else if (categorie === 'junior') {
			query.eq('Junior', 1)
			}

			if (dotationMin !== '' && !isNaN(Number(dotationMin))) {
			query.gte('dotation', Number(dotationMin))
			}

			const { data, error } = await query

			if (!error && data) {
			setTournois(data)
			} else {
			console.error('Erreur Supabase :', error?.message)
			}
		}

		fetchData()
		}, [categorie, dotationMin])


	return (
		<MainLayout>
			<h1 className="text-2xl font-semibold text-primary mb-4">Programmation de tournois</h1>

			<div className="mb-4 flex gap-4">
				<input type="text" placeholder="Rechercher un tournoi..." className="border border-gray-300 rounded px-3 py-2 w-1/3"/>
				<select className="border text-black border-gray-300 rounded px-3 py-2">
					<option value="all">Surface</option>
					<option value="dur">Dur</option>
					<option value="terre">Terre</option>
					<option value="gazon">Gazon</option>
				</select>
				<input type="number" placeholder="Dotation minimale (€)" className="border border-gray-300 rounded px-3 py-2 w-1/5 text-black" value={dotationMin} onChange={(e) => setDotationMin(Number(e.target.value))}/>
				<select className="border text-black border-gray-300 rounded px-3 py-2" value={categorie} onChange={(e) => setCategorie(e.target.value as 'all' | 'senior' | 'junior')}>
					<option value="all">Catégories</option>
					<option value="senior">Senior</option>
					<option value="junior">Junior</option>
				</select>

			</div>

			<table  className="w-full bg-white text-black shadow rounded-lg overflow-hidden">
				<thead className="bg-secondary text-left text-sm text-black">
				<tr>
					<th className="px-4 py-2">Nom</th>
					<th className="px-4 py-2">Date début</th>
					<th className="px-4 py-2">Date fin</th>
					<th className="px-4 py-2">Classement</th>
					<th className="px-4 py-2">Surface</th>
					<th className="px-4 py-2">Dotation</th>
				</tr>
				</thead>
				<tbody className="text-sm">
					{tournois
						.filter((t) => {
							if (categorie === 'senior') return t?.Senior === true
							if (categorie === 'junior') return t?.Junior === true

							return true // 'all' => pas de filtre
						})
						.map((t) => (
						<tr key={t?.idtournoi} className="hover:bg-gray-100 border-t" >
							<td className="px-4 py-2">{t?.libtournoi}</td>
							<td className="px-4 py-2">{t?.datdeb}</td>
							<td className="px-4 py-2">{t?.datfin}</td>
							<td className="px-4 py-2">{t?.classementSM}</td>
							<td className="px-4 py-2">{t?.surface}</td>
							<td className="px-4 py-2">{t?.dotation} €</td>
						</tr>
					))}
				</tbody>
			</table>
		</MainLayout>
	)
}
