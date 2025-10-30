'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSupabase } from "../providers";
import { Trophy, MapPin, Calendar, Euro, ExternalLink, Check, ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { usePlanificationCart } from '@/app/components/PlanificationCartContext'
import { PlanificationCartHeader } from '@/app/components/PlanificationCartHeader'

export default function TournamentsList() {
  const {supabase} = useSupabase()
  const { addToCart, isInCart } = usePlanificationCart()
  const [tournaments, setTournaments] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(50)
  const [search, setSearch] = useState('')
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([])
  const [availableSurfaces, setAvailableSurfaces] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'junior' | 'senior'>('all')
  const [orderFilter, setOrderFilter] = useState<'all' | 'prize' | 'datedeb' | 'datfin'>('all')
  const [loading, setLoading] = useState(true)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const [dateDebut, setDateDebut] = useState<Date>(new Date())
  const [dateFin, setDateFin] = useState<Date>(() => {
    const sixMonthsLater = new Date()
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6)
    return sixMonthsLater
  })

  useEffect(() => {
    loadTournaments()
  }, [])

  useEffect(() => {
    filterTournaments()
  }, [search, selectedSurfaces, categoryFilter, orderFilter, dateDebut, dateFin, tournaments])

  const loadTournaments = async () => {
    const { data, error } = await supabase
      .from('tournois')
      .select('*')
      .order('datdeb', { ascending: true })

    if (error) console.error(error)
    else {
      setTournaments(data || [])

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

    temp = temp.filter(t => {
      const tDebut = new Date(t.datdeb)
      const tFin = new Date(t.datfin ? t.datfin : t.datdeb)
      return tDebut >= dateDebut && tFin <= dateFin
    })

    switch (orderFilter) {
      case 'prize':
        temp.sort((a, b) => (b.dotation || 0) - (a.dotation || 0))
        break
      case 'datedeb':
        temp.sort((a, b) => new Date(a.datdeb).getTime() - new Date(b.datdeb).getTime())
        break
      case 'datfin':
        temp.sort((a, b) => new Date(a.datfin ? a.datfin : a.datdeb).getTime() - new Date(b.datfin ? b.datfin : b.datdeb).getTime())
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

  const handleSchedule = async (tournament: any) => {
    addToCart({
      idtournoi: tournament.idtournoi,
      libtournoi: tournament.libtournoi,
      datdeb: tournament.datdeb,
      datfin: tournament.datfin,
      adresse: tournament.adresse
    })
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

      {/* Planif en cours */}
      <PlanificationCartHeader />

      {/* Filtres */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <Input
          placeholder="Recherche nom ou ville..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {dateDebut ? format(dateDebut, "dd/MM/yyyy", { locale: fr }) : "Date début"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={dateDebut}
              onSelect={(date) => date && setDateDebut(date)}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {dateFin ? format(dateFin, "dd/MM/yyyy", { locale: fr }) : "Date fin"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={dateFin}
              onSelect={(date) => date && setDateFin(date)}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>

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
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
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
                    <Calendar className="w-4 h-4 mr-1 text-[#170647]" /> {t.datdeb} - {t.datfin ? t.datfin : t.datdeb}
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
					<TooltipProvider>
						<Tooltip>
						<TooltipTrigger asChild>
							<span className="inline-block w-full">
							{new Date(t.datfin ? t.datfin : t.datdeb) < new Date() ? (
								<Button
								disabled
								className="w-full cursor-not-allowed bg-gray-300 text-black cursor-not-allowed opacity-80"
								>
								<Calendar className="w-4 h-4 mr-2" />
								Tournoi terminé
								</Button>
							) : isInCart(t.idtournoi) ? (
								<Button
								disabled
								className="w-full bg-green-600 text-white cursor-not-allowed"
								>
								<Check className="w-4 h-4 mr-2" />
								Ajouté à la planification
								</Button>
							) : (
								<Button
								className="w-full bg-gradient-to-r from-[#170647] to-purple-600 hover:opacity-90"
								onClick={() => handleSchedule(t)}
								>
								<Plus className="w-4 h-4 mr-2" />
								Planifier
								</Button>
							)}
							</span>
						</TooltipTrigger>

						{new Date(t.datfin ? t.datfin : t.datdeb) < new Date() && (
							<TooltipContent>
							<p>Le tournoi est terminé, vous ne pouvez pas le planifier.</p>
							</TooltipContent>
						)}

						{isInCart(t.idtournoi) && (
							<TooltipContent>
							<p>Ce tournoi est déjà dans votre planification.</p>
							</TooltipContent>
						)}
						</Tooltip>
					</TooltipProvider>

					<Button
						variant="outline"
						onClick={() => window.open(`https://tenup.fft.fr/tournoi/${t.idtournoi}`, "_blank")}
					>
						<ExternalLink className="w-4 h-4 mr-2" /> TenUp
					</Button>
					</div>

                {/* <div className="mt-4 flex flex-col gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            className="bg-gradient-to-r from-[#170647] to-purple-600 w-full"
                            disabled={new Date(t.datfin ? t.datfin : t.datdeb) < new Date() || isInCart(t.idtournoi)}
                            onClick={() => handleSchedule(t)}
                          >
                            {isInCart(t.idtournoi) ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Ajouté à la planification
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Planifier
                              </>
                            )}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {new Date(t.datfin ? t.datfin : t.datdeb) < new Date() && (
                        <TooltipContent>
                          <p>Le tournoi est terminé, vous ne pouvez pas le planifier.</p>
                        </TooltipContent>
                      )}
                      {isInCart(t.idtournoi) && (
                        <TooltipContent>
                          <p>Ce tournoi est déjà dans votre planification.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>

                  <Button variant="outline" onClick={() => window.open(`https://tenup.fft.fr/tournoi/${t.idtournoi}`, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" /> TenUp
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div ref={loaderRef} className="h-10" />
    </div>
  )
}