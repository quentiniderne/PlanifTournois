'use client'

import MainLayout from '@/app/components/MainLayout'
import { useEffect, useState } from 'react'
import { getTournois } from '@/app/services/tournois'

export default function ProgrammationPage() {
	const [tournois, setTournois] = useState([])
		useEffect(() => {
		async function fetchData() {
		const data = await getTournois()
		setTournois(data)
		}
		fetchData()
		}, [])
	return (
		<MainLayout>

		<h1 className="text-2xl font-semibold text-primary mb-4">Programmation de tournois</h1>

		<div className="mb-4 flex gap-4">
			<input
			type="text"
			placeholder="Rechercher un tournoi..."
			className="border border-gray-300 rounded px-3 py-2 w-1/3"
			/>
			<select className="border border-gray-300 rounded px-3 py-2">
			<option>Surface</option>
			<option>Dur</option>
			<option>Terre</option>
			<option>Gazon</option>
			</select>
			<select className="border border-gray-300 rounded px-3 py-2">
			<option>Catégorie</option>
			<option>Senior</option>
			<option>Junior</option>
			</select>
		</div>

		<table className="w-full bg-white shadow rounded-lg overflow-hidden">
			<thead className="bg-secondary text-left text-sm text-gray-600">
			<tr>
				<th className="px-4 py-2">Nom</th>
				<th className="px-4 py-2">Date</th>
				<th className="px-4 py-2">Lieu</th>
				<th className="px-4 py-2">Surface</th>
			</tr>
			</thead>
			<tbody className="text-sm">
			<tr className="hover:bg-gray-100 border-t">
				<td className="px-4 py-2">Tournoi FFT Lyon</td>
				<td className="px-4 py-2">15/07/2025</td>
				<td className="px-4 py-2">Lyon</td>
				<td className="px-4 py-2">Terre</td>
			</tr>
			<tr className="hover:bg-gray-100 border-t">
				<td className="px-4 py-2">Open Sud</td>
				<td className="px-4 py-2">01/08/2025</td>
				<td className="px-4 py-2">Montpellier</td>
				<td className="px-4 py-2">Dur</td>
			</tr>
			</tbody>
		</table>
		</MainLayout>
	)
}
