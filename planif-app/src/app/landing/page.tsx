"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LandingPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 🔁 Vérifie la session au chargement
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router, supabase]);

  // ⏳ Petit écran de chargement le temps de vérifier la session
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Chargement...</p>
      </main>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push("/dashboard");
  };

  return (
    <main className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">🎾 Bienvenue sur SmashUp</h1>
      <p className="mb-8 text-gray-600 text-center max-w-md">
        Gérez vos programmations de tournois FFT facilement, avec un outil pensé pour les joueurs et clubs.
      </p>

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Connexion</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button type="submit" className="w-full bg-[#170647] text-white py-2 rounded hover:bg-blue-700 transition">
          Se connecter
        </button>
      </form>

      <p className="mt-4 text-gray-600">
        Pas encore de compte ?{" "}
        <button onClick={() => router.push("/signup")} className="text-[#170647] underline">
          S’inscrire
        </button>
      </p>
    </main>
  );
}
