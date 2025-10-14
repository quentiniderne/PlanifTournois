"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignupPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/home");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router, supabase]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Chargement...</p>
      </main>
    );
  }

  // 🧩 Création du compte
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          firstname: form.firstname,
          lastname: form.lastname,
        },
      },
    });

    if (error) setError(error.message);
    else router.push("/home");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Prénom"
            className="w-full p-2 border rounded mb-3"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Nom"
            className="w-full p-2 border rounded mb-3"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-2 border rounded mb-4"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            S’inscrire
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-center">
          Déjà un compte ?{" "}
          <button onClick={() => router.push("/landing")} className="text-blue-600 underline">
            Se connecter
          </button>
        </p>
      </div>
    </main>
  );
}
