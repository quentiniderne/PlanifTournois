"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "../providers";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Lock, Trophy, Sparkles, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect } from 'react'


export default function LoginPage() {
  const { supabase } = useSupabase(); // ← Remplace createClientComponentClient
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Récupère l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Vérifie si le profil existe et est complet
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('firstname, lastname')
          .eq('iduser', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // Erreur inattendue (pas "not found")
          setError("Erreur lors de la vérification du profil.");
          return;
        }

        // Redirige en fonction du profil
        if (!profile || !profile.firstname || !profile.lastname) {
          router.push('/completeProfile');
        } else {
          router.push('/dashboard');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-purple-100 bg-white/80 backdrop-blur-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <div className="bg-gradient-to-br from-[#170647] to-purple-600 p-3 rounded-xl">
              <Trophy className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#170647] to-purple-600 bg-clip-text text-transparent">
            Connexion
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Connecte-toi pour accéder à ton tableau de bord SmashUp.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Adresse e-mail
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-purple-500">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full focus:outline-none text-gray-800"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Mot de passe
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-purple-500">
                <Lock className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full focus:outline-none text-gray-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="bg-gradient-to-r h-10 from-[#170647] to-purple-600 hover:opacity-90 shadow-lg shadow-purple-500/30 w-full text-white cursor-pointer"
            >
              Se connecter
            </button>

            {error && (
              <p
                className={`text-center text-sm mt-2 ${
                  error.includes("Erreur") ? "text-red-500" : "text-green-600"
                }`}
              >
                {error}
              </p>
            )}

            <div className="text-center mt-4 text-sm text-gray-600">
              Pas encore inscrit ?{" "}
              <Link
                href="/signup"
                className="text-purple-700 hover:underline font-medium"
              >
                Créer un compte
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">Ou tester directement un essai gratuit :</p>
            <Link href="/signup?demo=true">
              <Button
                variant="outline"
                className="border-2 border-[#170647] text-[#170647] hover:bg-purple-50 w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Essayer gratuitement pendant 1 mois
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
