'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Tournament {
  idtournoi: number
  libtournoi: string
  datdeb: string
  datfin: string | null
  adresse?: string
}

interface CartContextType {
  cart: Tournament[]
  addToCart: (tournament: Tournament) => void
  removeFromCart: (idtournoi: number) => void
  clearCart: () => void
  isInCart: (idtournoi: number) => boolean
}

const PlanificationCartContext = createContext<CartContextType | undefined>(undefined)

export function PlanificationCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Tournament[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Charger la planif depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('planification-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Erreur chargement planification:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Sauvegarder la planif dans localStorage à chaque modification
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('planification-cart', JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  const addToCart = (tournament: Tournament) => {
    setCart(prev => {
      // Vérifier si le tournoi n'est pas déjà dans la planif
      if (prev.some(t => t.idtournoi === tournament.idtournoi)) {
        return prev
      }
      return [...prev, tournament]
    })
  }

  const removeFromCart = (idtournoi: number) => {
    setCart(prev => prev.filter(t => t.idtournoi !== idtournoi))
  }

  const clearCart = () => {
    setCart([])
  }

  const isInCart = (idtournoi: number) => {
    return cart.some(t => t.idtournoi === idtournoi)
  }

  return (
    <PlanificationCartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </PlanificationCartContext.Provider>
  )
}

export function usePlanificationCart() {
  const context = useContext(PlanificationCartContext)
  if (context === undefined) {
    throw new Error('usePlanificationCart must be used within a PlanificationCartProvider')
  }
  return context
}