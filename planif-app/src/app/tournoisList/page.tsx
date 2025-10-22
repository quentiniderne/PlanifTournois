'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Trophy, Search, MapPin, Calendar, Euro, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent} from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function TournamentsList() {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [surfaceFilter, setSurfaceFilter] = useState<'all' | string>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'junior' | 'senior'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTournaments()
  }, [])

  useEffect(() => {
    filterTournaments()
  }, [search, surfaceFilter, categoryFilter, tournaments])

  const loadTournaments = async () => {
    const { data, error } = await supabase
      .from('tournois')
      .select('*')
      .order('datdeb', { ascending: true })
    if (error) console.error(error)
    else setTournaments(data || [])
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

    if (surfaceFilter !== 'all') temp = temp.filter(t => t.surface === surfaceFilter)
    if (categoryFilter !== 'all') temp = temp.filter(t =>
      categoryFilter === 'junior' ? t.junior === 1 : t.senior === 1
    )

    setFiltered(temp)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const handleSchedule = async (idtournoi: number) => {
    alert(`Planification pour tournoi ${idtournoi} !`)
    // Ici tu peux ajouter ton endpoint Supabase pour enregistrer le tournoi
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Trophy className="h-12 w-12 text-[#170647] animate-pulse" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Liste des tournois</h1>

      {/* Filtres */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div>
          <Input 
            placeholder="Recherche nom ou ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={surfaceFilter} onValueChange={setSurfaceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Surface" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="Dur">Dur</SelectItem>
            <SelectItem value="Terre battue">Terre battue</SelectItem>
            <SelectItem value="Gazon">Gazon</SelectItem>
            <SelectItem value="Indoor">Indoor</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="junior">Junior</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste de tournois */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Aucun tournoi trouvé
          </div>
        ) : (
          filtered.map(t => (
            <Card key={t.idtournoi} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold">{t.libtournoi}</h2>
                    {t.surface && <Badge>{t.surface}</Badge>}
                  </div>

                  {t.adresse && (
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1 text-[#170647]" /> {t.adresse}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-1 text-[#170647]" /> {formatDate(t.datdeb)} - {formatDate(t.datfin)}
                  </div>

                  {t.dotation && (
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Euro className="w-4 h-4 mr-1 text-[#170647]" /> Dotation: {t.dotation} €
                    </div>
                  )}

                  {t.classementSM && (
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">Classement SM:</span> {t.classementSM}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Button className="bg-gradient-to-r from-[#170647] to-purple-600" onClick={() => handleSchedule(t.idtournoi)}>
                    Planifier
                  </Button>
                  <Button variant="outline" onClick={() => window.open(`https://tenup.fft.fr/tournoi/${t.idtournoi}`, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" /> TenUp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
