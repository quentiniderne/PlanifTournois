"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Sparkles, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
	
	const router = useRouter();
	const searchParams = useSearchParams();
	const isDemo = searchParams?.get("demo") === "true";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(null);


	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		const { data, error } = await supabase.auth.signUp({
		email,
		password,
		});

		if (error) {
		setMessage("Erreur lors de l'inscription : " + error.message);
		setLoading(false);
		return;
		}

		if (data.user) {
		// Création du profil associé
		const payload = {
			iduser: data.user.id,
			demo: isDemo,
			findemo: isDemo ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
		};

		const { error: profileError } = await supabase
			.from("profiles")
			.upsert(payload, { onConflict: "iduser" });

		if (profileError) {
			setMessage("Erreur lors de la création du profil : " + profileError.message);
		} else {
			setMessage(
			"Inscription réussie ! Vérifie ton e-mail pour confirmer ton compte."
			);
		}
		}

		setLoading(false);
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
            {isDemo ? "Essai gratuit 30 jours" : "Créer un compte"}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {isDemo
              ? "Profite de toutes les fonctionnalités gratuitement pendant 30 jours."
              : "Rejoins SmashUp et commence à planifier ta saison tennistique."}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-5">
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full focus:outline-none text-gray-800"
                  placeholder="••••••••"
                />
              </div>
            </div>
			{!isDemo && (
			<div className="mt-6 p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border-2 border-purple-100">
				<h3 className="text-xl font-bold text-gray-900 mb-4">Choisissez votre offre</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Option mensuelle */}
					<div
						className={`cursor-pointer p-4 rounded-xl border-2 ${
						selectedPlan === "monthly" ? "border-purple-600 shadow-lg" : "border-gray-300"
						} hover:border-purple-500 transition-all`}
						onClick={() => setSelectedPlan("monthly")}
					>
						<p className="text-gray-700 font-medium">2€/mois</p>
						<p className="text-gray-500 text-sm">Paiement mensuel, sans engagement</p>
					</div>

					{/* Option annuelle */}
					<div
						className={`cursor-pointer p-4 rounded-xl border-2 ${
						selectedPlan === "yearly" ? "border-purple-600 shadow-lg" : "border-gray-300"
						} hover:border-purple-500 transition-all`}
						onClick={() => setSelectedPlan("yearly")}
					>
						<p className="text-gray-700 font-medium">20€/an</p>
						<p className="text-green-600 font-semibold text-sm">-20% par rapport au mensuel !</p>
					</div>
				</div>
			</div>
			)}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-lg font-medium text-white shadow-lg shadow-purple-500/30 ${
                isDemo
                  ? "bg-gradient-to-r from-[#170647] to-purple-600 hover:opacity-90"
                  : "bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90"
              }`}
            >
              {loading ? "Inscription en cours..." : isDemo ? "Commencer l’essai gratuit" : "Créer mon compte"}
            </Button>

            {message && (
              <p
                className={`text-center text-sm mt-2 ${
                  message.includes("Erreur") ? "text-red-500" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="text-center mt-4 text-sm text-gray-600">
              Déjà inscrit ?{" "}
              <Link
                href="/login"
                className="text-purple-700 hover:underline font-medium"
              >
                Se connecter
              </Link>
            </div>
          </form>

          {!isDemo && (
            <div className="mt-6 text-center border-t pt-4">
				<p className="text-sm text-gray-500 mb-2">Ou essaye gratuitement :</p>
				<Button
				variant="outline"
				className="border-2 border-[#170647] text-[#170647] hover:bg-purple-50"
				onClick={() => router.push("/signup?demo=true")}
				>
				<Sparkles className="h-4 w-4 mr-2" />
				Essayer gratuitement pendant 1 mois
				</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
