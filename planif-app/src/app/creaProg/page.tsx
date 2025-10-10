'use client'

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

export default function CreationProgrammation() {
  const [selectedStart, setSelectedStart] = useState<Date | undefined>();
  const [selectedEnd, setSelectedEnd] = useState<Date | undefined>();
  const [typeTournoi, setTypeTournoi] = useState<string>("tous");
  const [distance, setDistance] = useState<number>(50);

  const handleSubmit = () => {
    console.log("Filtres choisis :", {
      debut: selectedStart,
      fin: selectedEnd,
      typeTournoi,
      distance,
    });
    // Plus tard : navigation vers la page de résultats filtrés
  };

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Créer une programmation</h1>
      <p className="mb-8 text-gray-700">Définis tes critères pour rechercher des tournois adaptés.</p>

      {/* Sélecteur de dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="border p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-3 text-[#170647]">Date de début</h2>
          <DayPicker
            mode="single"
            selected={selectedStart}
            onSelect={setSelectedStart}
            locale={fr}
          />
          {selectedStart && (
            <p className="text-sm mt-2 text-gray-600">
              Sélectionné : {format(selectedStart, "dd/MM/yyyy")}
            </p>
          )}
        </div>

        <div className="border p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-3 text-[#170647]">Date de fin</h2>
          <DayPicker
            mode="single"
            selected={selectedEnd}
            onSelect={setSelectedEnd}
            locale={fr}
          />
          {selectedEnd && (
            <p className="text-sm mt-2 text-gray-600">
              Sélectionné : {format(selectedEnd, "dd/MM/yyyy")}
            </p>
          )}
        </div>
      </div>

      {/* Type de tournoi */}
      <div className="mb-8">
        <h2 className="font-semibold mb-3 text-[#170647]">Type de tournoi</h2>
        <select
          className="border border-gray-300 rounded px-3 py-2 text-black"
          value={typeTournoi}
          onChange={(e) => setTypeTournoi(e.target.value)}
        >
          <option value="tous">Tous les tournois</option>
          <option value="tmc">Tournoi Multi-Chances (TMC)</option>
          <option value="argent">Tournoi avec dotation</option>
          <option value="loisir">Tournoi loisir / amical</option>
        </select>
      </div>

      {/* Distance (slider) */}
      <div className="mb-8">
        <h2 className="font-semibold mb-3 text-[#170647]">Distance maximale</h2>
        <input
          type="range"
          min="1"
          max="300"
          step="1"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm mt-2 text-gray-600">
          {distance < 300
            ? `${distance} km autour de ton adresse`
            : "Toute la France 🇫🇷"}
        </p>
      </div>

      {/* Bouton de validation */}
      <button
        onClick={handleSubmit}
        className="bg-[#170647] text-white px-6 py-3 rounded-lg hover:bg-[#2a1085] transition"
      >
        Lancer la recherche
      </button>
    </div>
  );
}
