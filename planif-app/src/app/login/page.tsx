"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from 'next/link'

export default function LoginPage() {
const supabase = createClientComponentClient();
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [message, setMessage] = useState<string | null>(null);
const router = useRouter()

useEffect(() => {
	const email = localStorage.getItem("pendingEmail");
	if (email) {
	setEmail(email);
	localStorage.removeItem("pendingEmail"); // Optionnel
	}
}, []);


const handleLogin = async () => {
	const { data: loginData, error } = await supabase.auth.signInWithPassword({ email, password });


	if (error || !loginData.user) {
	setMessage('Connexion échouée : ' + error?.message);
	return;
	}

	const userId = loginData.user.id;

	// Vérifier si un profil existe dans la table profiles
	const { data: profile, error: profileError } = await supabase
	.from('profiles')
	.select('*')
	.eq('iduser', userId)
	.single();

	if (profileError || !profile) {
	// Si ce n'est pas le cas, on dirige vers la page de complétion du profil
	router.push('/completeProfile');
	} else {
	//  Vérifier si la démo a expiré
	if (profile.is_demo && profile.demo_started_at) {
		const now = new Date();

		if (now > profile.demo_expires_at) {
		// Mettre à jour is_demo = false
		await supabase
			.from('profiles')
			.update({ is_demo: false })
			.eq('id', userId);
	}
}
	// Sinon, on dirige vers le dashboard de l'utilisateur
	router.push('/dashboard');
	}

};

return (	
	<main className="flex flex-col items-center justify-center bg-gray-100 p-6">
		<h1 className="text-4xl font-bold mb-6 text-center"> Bienvenue sur SmashUp</h1>
		<p className="mb-8 text-gray-600 text-center max-w-md">
			Gérez vos programmations de tournois FFT facilement, avec un outil pensé pour les joueurs et clubs.
		</p>

		{/* Formulaire de connexion */}
		<div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
			<h1 className="text-2xl flex justify-center font-bold">Connexion</h1>
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
				onChange={(e) => setPassword(e.target.value)}
			/>
			<div className='flex justify-between'>
				{/*Bouton de connexion */}
				<button
					onClick={handleLogin}
					className="bg-[#170647] text-white w-full px-4 py-2 rounded cursor-pointer"
				>
					Se connecter
				</button>

				{/* Réinitialisation du mot de passe */}
				{/* Désactivé pour le moment
				<Link
					href='/forgotPassword'
				>
					<p className="text-sm text-blue-600 hover:underline">
					Mot de passe oublié ?
					</p>
				</Link>*/}
			</div>

			{/* Message d'erreur s'il y en a un */}
			{message && <p className="mt-1 text-center text-red-600">{message}</p>}

			<p className="text-sm text-center mt-6">
				Vous n’avez pas de compte ?{" "}
				<Link href="/signup" className="text-blue-600 hover:underline">
					Créer un compte
				</Link>
			</p>
		</div>
	</main>
);
}

