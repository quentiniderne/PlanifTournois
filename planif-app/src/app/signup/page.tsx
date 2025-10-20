"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

export default function SignupPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState<string | null>(null);

const handleSignup = async (e: React.FormEvent) => {
	e.preventDefault();
	setLoading(true);
	setMessage(null);

	const { error } = await supabase.auth.signUp({
	email,
	password,
	options: {
		emailRedirectTo: `${window.location.origin}/login`, // ou /login si tu veux forcer la connexion ensuite
	},
	});

	if (error) {
	setMessage(`Erreur : ${error.message}`);
	} else {
	setMessage("Compte créé ! Vérifie ton email pour confirmer ton inscription.");
	}

	setLoading(false);
};

return (
	<div>
		<main className="flex flex-col items-center justify-center p-6">
			<h1 className="text-4xl font-bold mb-6 text-center">Bienvenue sur SmashUp</h1>
			<p className="mb-8 text-gray-600 text-center max-w-md">
				Gérez vos programmations de tournois facilement, avec un outil pensé pour les joueurs et clubs.
			</p>
			<div className="bg-[#170647]/10 p-6 rounded-2xl border-solid shadow-xl w-full max-w-sm">
				<h1 className="text-2xl flex justify-center font-bold mb-6">Créer un compte</h1>

				<form onSubmit={handleSignup} className="space-y-4">
					<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="w-full border rounded p-2"
					/>

					<input
					type="password"
					placeholder="Mot de passe"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full border rounded p-2"
					/>

					<button
					type="submit"
					disabled={loading}
					className="bg-[#170647] hover:bg-[#170647]/90 text-white w-full px-4 py-2 rounded cursor-pointer"
					>
					{loading ? "Création..." : "Créer le compte"}
					</button>
				</form>

				{message && (
					<p
					className={`mt-4 text-center ${
						message.startsWith("Erreur") ? "text-red-600" : "text-green-600"
					}`}
					>
					{message}
					</p>
				)}

				<p className="text-sm text-center mt-6">
					Déjà un compte ?{" "}
					<Link href="/login" className="text-blue-600 hover:underline">
					Connexion
					</Link>
				</p>
			</div>
		</main>
	</div>
);
}
