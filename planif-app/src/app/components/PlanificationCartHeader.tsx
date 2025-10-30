'use client'

import { useState } from 'react'
import { usePlanificationCart } from './PlanificationCartContext'
import { List, ChevronDown, ChevronUp, X, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

export function PlanificationCartHeader() {
  const { cart, removeFromCart, clearCart } = usePlanificationCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  if (cart.length === 0) {
    return null
  }

  return (
    <Card className="mb-6 border-2 border-[#170647]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <List className="h-5 w-5 text-[#170647]" />
            <CardTitle className="text-lg">
              Nouvelle planification en cours
            </CardTitle>
            <Badge variant="secondary" className="bg-[#170647] text-white">
              {cart.length} tournoi{cart.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/planification/new')}
              className="bg-gradient-to-r from-[#170647] to-purple-600 text-white hover:opacity-90"
            >
              Valider la planification
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-2">
            {cart.map(tournament => (
              <div
                key={tournament.idtournoi}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{tournament.libtournoi}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    {tournament.adresse && (
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {tournament.adresse}
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      {tournament.datdeb} - {tournament.datfin || tournament.datdeb}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(tournament.idtournoi)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              Supprimer tous les tournois
            </Button>
            <Button
              onClick={() => router.push('/planification/new')}
              className="bg-gradient-to-r from-[#170647] to-purple-600"
            >
              Valider la planification
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}