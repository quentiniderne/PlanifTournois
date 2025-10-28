"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/supabase";
import { BASE_CLASSEMENTS, HOMME_EXTRAS, FEMME_EXTRAS } from "@/app/lib/classements";
import { COUNTRIES } from "@/app/lib/countries";

export default function CompleteProfilePage() {
const router = useRouter();

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [message, setMessage] = useState<string | null>(null);

// form state
const [firstname, setFirstname] = useState("");
const [lastname, setLastname] = useState("");
const [email, setEmail] = useState("");
const [adresse, setAdresse] = useState("");
const [ville, setVille] = useState("");
const [zipcode, setZipcode] = useState("");
const [sexe, setSexe] = useState(""); // "Homme" | "Femme"
const [classementFr, setClassementFr] = useState("");
const [classementUtr, setClassementUtr] = useState(""); // keep as string for input
const [classementAtp, setClassementAtp] = useState(""); // keep as string


// dynamic extras depending on sexe
const hommeExtras = ["N100–N60", "N59-N31", "N30–N1"];
const femmeExtras = ["N60–N21", "N20–N1"];

// final options computed
    const classementOptions = [
    ...BASE_CLASSEMENTS,
    ...(sexe === "Homme" ? HOMME_EXTRAS : []),
    ...(sexe === "Femme" ? FEMME_EXTRAS : []),
    ];


// On mount : get user and check if profile already has firstname -> redirect to /home
useEffect(() => {
    const init = async () => {
    try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) {
        console.error("Erreur getUser:", userErr);
        setLoading(false);
        return;
        }
        const user = userData.user;
        if (!user) {
        router.push("/login");
        return;
        }

        setEmail(user.email ?? "");

        // check profiles table for iduser && annule = 0
        const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("firstname")
        .eq("iduser", user.id)
        .eq("annule", 0)
        .maybeSingle(); // maybeSingle avoids throwing when not found

        if (profile && profile.firstname) {
        // profile already has firstname -> go to home
        router.replace("/home");
        return;
        }

        // else show the form
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    init();
}, [router]);

// validation helpers
const validateForm = () => {
    if (!firstname.trim()) {
    setMessage("Le prénom est obligatoire.");
    return false;
    }
    if (!lastname.trim()) {
    setMessage("Le nom est obligatoire.");
    return false;
    }
    // UTR: optional but if provided must be a number with max 2 decimals
    if (classementUtr) {
    const num = Number(classementUtr);
    if (Number.isNaN(num)) {
        setMessage("Le classement UTR doit être un nombre.");
        return false;
    }
    // round to 2 decimals
    const rounded = Math.round(num * 100) / 100;
    if (Math.abs(num - rounded) > 1e-9) {
        // more than 2 decimals
        setMessage("Le classement UTR ne doit contenir que 2 décimales au maximum.");
        return false;
    }
    }
    // ATP: optional but if provided must be integer up to 4 digits
    if (classementAtp) {
    if (!/^\d{1,4}$/.test(classementAtp)) {
        setMessage("Le classement ATP doit être un nombre entier (jusqu'à 4 chiffres).");
        return false;
    }
    }

    // sexe optional? If you want to force selection, uncomment:
    // if (!sexe) { setMessage("Veuillez sélectionner le sexe."); return false }

    setMessage(null);
    return true;
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setMessage(null);

    try {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    const user = userData.user;
    if (!user) {
        setMessage("Utilisateur non connecté.");
        setSaving(false);
        return;
    }

    const now = new Date();
    const demofinDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // prepare payload
    const payload: any = {
        iduser: user.id,
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email || null,
        adress: adresse || null,
        city: ville || null,
        zipcode: zipcode || null,
        sex: sexe || null,
        ranking_fr: classementFr || null,
        utr: classementUtr ? Math.round(Number(classementUtr) * 100) / 100 : null, // number, 2 decimals
        ranking_wrld: classementAtp ? parseInt(classementAtp, 10) : null,
        created_at: now.toISOString(),
        datmaj: now.toISOString(),
        annule: 0,
        demo: 1,
        demofin: demofinDate.toISOString(),
    };

    // upsert (onConflict iduser) so it updates if row already exists
    const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "iduser"});

    if (error) {
        console.error("Supabase error:", error);
        setMessage("Erreur lors de l'enregistrement : " + error.message);
        setSaving(false);
        return;
    }

    setMessage("Profil enregistré. Redirection…");
    // small delay for UX
    setTimeout(() => router.push("/dashboard"), 700);
    } catch (err: any) {
    console.error(err);
    setMessage("Erreur inattendue.");
    } finally {
    setSaving(false);
    }
};

if (loading) {
    return (
    <main className="min-h-screen flex items-center justify-center">
        <p>Chargement…</p>
    </main>
    );
}

return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center text-[#170647] mb-4">Compléter votre profil</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Prénom *</label>
            <input
            name="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
            placeholder="Ton prénom"
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
            name="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
            placeholder="Ton nom"
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
            name="email"
            value={email}
            readOnly
            className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <input
            name="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Adresse (optionnel)"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium mb-1">Ville</label>
            <input
                name="ville"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="Ville (optionnel)"
            />
            </div>
            <div>
            <label className="block text-sm font-medium mb-1">Code postal</label>
            <input
                name="zipcode"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="Code postal (optionnel)"
            />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Sexe</label>
            <select
            name="sexe"
            value={sexe}
            onChange={(e) => {
                setSexe(e.target.value);
                // keep classementFr if still valid; else reset
                if (e.target.value === "Homme") {
                if (![...classementOptions, ...hommeExtras].includes(classementFr)) {
                    setClassementFr("");
                }
                } else if (e.target.value === "Femme") {
                if (![...classementOptions, ...femmeExtras].includes(classementFr)) {
                    setClassementFr("");
                }
                } else {
                if (!classementOptions.includes(classementFr)) setClassementFr("");
                }
            }}
            className="w-full border rounded-lg p-2"
            >
            <option value="">-- Sélectionnez --</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Classement français</label>
            <select
            name="classementfr"
            value={classementFr}
            onChange={(e) => setClassementFr(e.target.value)}
            className="w-full border rounded-lg p-2"
            >
            <option value="">-- Sélectionnez (optionnel) --</option>
            {classementOptions.map((c) => (
                <option key={c} value={c}>
                {c}
                </option>
            ))}
            {/* always render base first, then dynamic extras */}
            {sexe === "Homme" &&
                hommeExtras.map((c) => (
                <option key={c} value={c}>
                    {c}
                </option>
                ))}
            {sexe === "Femme" &&
                femmeExtras.map((c) => (
                <option key={c} value={c}>
                    {c}
                </option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Classement UTR</label>
            <input
            name="classement_utr"
            type="number"
            step="0.01"
            value={classementUtr}
            onChange={(e) => setClassementUtr(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Ex: 6.12"
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Classement ATP/WTA</label>
            <input
            name="classement_atp"
            type="number"
            inputMode="numeric"
            min={0}
            max={9999}
            value={classementAtp}
            onChange={(e) => setClassementAtp(e.target.value.replace(/\D/g, ""))} // keep digits only
            className="w-full border rounded-lg p-2"
            placeholder="Ex: 1023"
            />
        </div>

        {message && (
            <p className={`text-center ${message.includes("enregistré") ? "text-green-600" : "text-red-600"}`}>
            {message}
            </p>
        )}

        <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 bg-[#170647] text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
        >
            {saving ? "Enregistrement..." : "Enregistrer le profil"}
        </button>
        </form>
    </div>
    </main>
);
}
