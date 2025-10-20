'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage("Email ou mot de passe incorrect.")
      setLoading(false)
      return
    }

    setMessage("Connexion réussie ✅")
    setLoading(false)

    // Vérifie si le profil existe déjà et possède un firstname
    const { data: profile } = await supabase
      .from('profiles')
      .select('firstname')
      .eq('iduser', data.user.id)
      .eq('annule', 0)
      .maybeSingle()

    if (profile && profile.firstname) {
      router.push('/home')
    } else {
      router.push('/completeProfile')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Bienvenue sur SmashUp</h1>
      <p className="mb-8 text-gray-600 text-center max-w-md">
        Gérez vos programmations de tournois FFT facilement, avec un outil pensé pour les joueurs et clubs.
      </p>

      <div className="bg-[#170647]/10 p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl flex justify-center font-bold mb-4">Connexion</h1>

        <input
          className="w-full p-2 border my-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-2 border rounded"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-[#170647] text-white w-full px-4 py-2 rounded cursor-pointer hover:bg-[#170647]/90"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        {message && (
          <p
            className={`mt-3 text-center ${
              message.includes('réussie') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-sm text-center mt-6">
          Vous n’avez pas de compte ?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  )
}
