'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSupabase } from "../providers";
import { Trophy, MapPin, Calendar, Euro, ExternalLink, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


export default function TournamentsList() {
const {supabase} = useSupabase()
const [tournaments, setTournaments] = useState<any[]>([])
const [filtered, setFiltered] = useState<any[]>([])
const [visibleCount, setVisibleCount] = useState(50)
const [search, setSearch] = useState('')
const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]) // ✅ plusieurs surfaces sélectionnées
const [availableSurfaces, setAvailableSurfaces] = useState<string[]>([]) // ✅ surfaces uniques extraites
const [categoryFilter, setCategoryFilter] = useState<'all' | 'junior' | 'senior'>('all')
const [orderFilter, setOrderFilter] = useState<'all' | 'prize' | 'datedeb' | 'datfin'>('all')
const [loading, setLoading] = useState(true)
const loaderRef = useRef<HTMLDivElement | null>(null)

useEffect(() => {
	loadTournaments()
}, [])

useEffect(() => {
	filterTournaments()
}, [search, selectedSurfaces, categoryFilter, orderFilter, tournaments])

const loadTournaments = async () => {
	const { data, error } = await supabase
	.from('tournois')
	.select('*')
	.order('datdeb', { ascending: true })

	if (error) console.error(error)
	else {
	setTournaments(data || [])

	// ✅ Extraire surfaces uniques
	const surfaces = Array.from(
		new Set(
		data?.flatMap(t =>
			t.surface
			? t.surface.split(',').map((s: string) => s.trim()).filter(Boolean)
			: []
		)
		)
	)
	setAvailableSurfaces(surfaces)
	}

	setLoading(false)
}

const filterTournaments = () => {
	let temp = [...tournaments]

	if (search) {
	temp = temp.filter(t =>
		(t.libtournoi?.toLowerCase().includes(search.toLowerCase()) ||
		t.adresse?.toLowerCase().includes(search.toLowerCase()))
	)
	}

	// ✅ Nouveau filtre multi-surfaces
	if (selectedSurfaces.length > 0) {
	temp = temp.filter(t => {
		const tSurfaces = t.surface?.split(',').map((s: string) => s.trim()) || []
		return selectedSurfaces.some(sel => tSurfaces.includes(sel))
	})
	}

	if (categoryFilter !== 'all') {
	temp = temp.filter(t =>
		categoryFilter === 'junior' ? t.junior === 1 : t.senior === 1
	)
	}

	switch (orderFilter) {
	case 'prize':
		temp.sort((a, b) => (b.dotation || 0) - (a.dotation || 0))
		break
	case 'datedeb':
		temp.sort((a, b) => new Date(a.datdeb).getTime() - new Date(b.datdeb).getTime())
		break
	case 'datfin':
		temp.sort((a, b) => new Date(a.datfin).getTime() - new Date(b.datfin).getTime())
		break
	}

	setVisibleCount(50)
	setFiltered(temp)
}

const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
	const target = entries[0]
	if (target.isIntersecting) {
	setVisibleCount((prev) => Math.min(prev + 50, filtered.length))
	}
}, [filtered.length])

useEffect(() => {
	const option = { root: null, rootMargin: '20px', threshold: 1.0 }
	const observer = new IntersectionObserver(handleObserver, option)
	if (loaderRef.current) observer.observe(loaderRef.current)
	return () => observer.disconnect()
}, [handleObserver])

const handleSchedule = async (idtournoi: number) => {
	alert(`Planification pour tournoi ${idtournoi} !`)
}

if (loading) {
	return (
	<div className="min-h-screen flex items-center justify-center">
		<Trophy className="h-12 w-12 text-[#170647] animate-pulse" />
	</div>
	)
}

const displayed = filtered.slice(0, visibleCount)

return (
	<div className="container mx-auto px-4 py-8">
	<h1 className="text-3xl font-bold mb-6">Liste des tournois</h1>

	{/* Filtres */}
	<div className="grid md:grid-cols-4 gap-4 mb-8">
		<Input
		placeholder="Recherche nom ou ville..."
		value={search}
		onChange={(e) => setSearch(e.target.value)}
		/>

		{/* ✅ Multi-select surfaces */}
		<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="outline" className="justify-between">
			{selectedSurfaces.length > 0
				? `${selectedSurfaces.join(', ')}`
				: 'Surfaces'}
			<ChevronDown className="ml-2 h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent className="w-56">
			{availableSurfaces.map(surface => (
			<DropdownMenuCheckboxItem
				key={surface}
				checked={selectedSurfaces.includes(surface)}
				onCheckedChange={(checked) => {
				if (checked) {
					setSelectedSurfaces(prev => [...prev, surface])
				} else {
					setSelectedSurfaces(prev => prev.filter(s => s !== surface))
				}
				}}
			>
				{surface}
			</DropdownMenuCheckboxItem>
			))}
		</DropdownMenuContent>
		</DropdownMenu>

		<Select value={categoryFilter} onValueChange={setCategoryFilter}>
		<SelectTrigger>
			<SelectValue placeholder="Catégorie" />
		</SelectTrigger>
		<SelectContent>
			<SelectItem value="all">Toutes catégories</SelectItem>
			<SelectItem value="junior">Junior</SelectItem>
			<SelectItem value="senior">Senior</SelectItem>
		</SelectContent>
		</Select>

		<Select value={orderFilter} onValueChange={setOrderFilter}>
		<SelectTrigger>
			<SelectValue placeholder="Trier par" />
		</SelectTrigger>
		<SelectContent>
			<SelectItem value="all">Aucun tri</SelectItem>
			<SelectItem value="prize">Dotation</SelectItem>
			<SelectItem value="datedeb">Date de début</SelectItem>
			<SelectItem value="datfin">Date de fin</SelectItem>
		</SelectContent>
		</Select>
	</div>

	{/* Liste des tournois */}
	<div className="grid md:grid-cols-2 gap-6">
		{displayed.length === 0 ? (
		<div className="col-span-full text-center text-gray-500">
			Aucun tournoi trouvé
		</div>
		) : (
		displayed.map(t => (
			<Card key={t.idtournoi} className="hover:shadow-lg transition-shadow">
			<CardContent className="flex flex-col justify-between h-full">
				<div>
				<div className="flex justify-between items-start mt-2 mb-2">
					<h2 className="text-xl font-bold">{t.libtournoi}</h2>
					{t.surface && <Badge>{t.surface}</Badge>}
				</div>

				{t.adresse && (
					<div className="flex items-center text-sm text-gray-600 mb-1">
					<MapPin className="w-4 h-4 mr-1 text-[#170647]" /> {t.adresse}
					</div>
				)}

				<div className="flex items-center text-sm text-gray-600 mb-1">
					<Calendar className="w-4 h-4 mr-1 text-[#170647]" /> {t.datdeb} - {t.datfin}
				</div>

				<div className="flex items-center text-sm text-gray-600 mb-1">
					<Euro className="w-4 h-4 mr-1 text-[#170647]" /> {t.dotation || 0} €
				</div>

				{t.classementSM && (
					<div className="text-xs text-gray-700">
					<span className="font-medium">SM:</span> {t.classementSM}
					</div>
				)}
				{t.classementSD && (
					<div className="text-xs text-gray-700">
					<span className="font-medium">SD:</span> {t.classementSD}
					</div>
				)}
				</div>

				<div className="mt-4 flex flex-col gap-2">
				{/* <Button className="bg-gradient-to-r from-[#170647] to-purple-600" onClick={() => handleSchedule(t.idtournoi)}>
					Planifier
				</Button> */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span>
								<Button
								className="bg-gradient-to-r from-[#170647] to-purple-600 w-full"
								disabled={new Date(t.datfin) < new Date()}
								onClick={() => handleSchedule(t.idtournoi)}
								>
								Planifier
								</Button>
							</span>
						</TooltipTrigger>
						{new Date(t.datfin) < new Date() && (
						<TooltipContent>
							<p>Le tournoi est terminé, vous ne pouvez pas le planifier.</p>
						</TooltipContent>
						)}
					</Tooltip>
				</TooltipProvider>

				<Button variant="outline" onClick={() => window.open(`https://tenup.fft.fr/tournoi/${t.idtournoi}`, '_blank')}>
					<ExternalLink className="w-4 h-4 mr-2" /> TenUp
				</Button>
				</div>
			</CardContent>
			</Card>
		))
		)}
	</div>

	<div ref={loaderRef} className="h-10" />
	</div>
)
}
