"use client";

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
	console.log({
	debut: selectedStart,
	fin: selectedEnd,
	typeTournoi,
	distance,
	});
};

return (
	<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
	<h1 className="text-2xl font-bold mb-4">Créer une programmation</h1>
	<p className="text-gray-700 mb-6">
		Définis tes critères pour rechercher des tournois adaptés.
	</p>

	{/* Bloc des calendriers côte à côte */}
	<div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
		<div className="border p-4 rounded-lg shadow text-center bg-white scale-90">
		<h2 className="font-semibold mb-2 text-[#170647]">Date de début</h2>
		<DayPicker
			mode="single"
			selected={selectedStart}
			onSelect={setSelectedStart}
			locale={fr}
		/>
		{selectedStart && (
			<p className="text-sm text-gray-600 mt-1">
			{format(selectedStart, "dd/MM/yyyy")}
			</p>
		)}
		</div>

		<div className="border p-4 rounded-lg shadow text-center bg-white scale-90">
		<h2 className="font-semibold mb-2 text-[#170647]">Date de fin</h2>
		<DayPicker
			mode="single"
			selected={selectedEnd}
			onSelect={setSelectedEnd}
			locale={fr}
		/>
		{selectedEnd && (
			<p className="text-sm text-gray-600 mt-1">
			{format(selectedEnd, "dd/MM/yyyy")}
			</p>
		)}
		</div>
	</div>

	{/* Autres filtres en dessous */}
	<div className="flex flex-col items-center w-full max-w-sm gap-6 bg-white p-6 rounded-xl shadow-md">
		{/* Type de tournoi */}
		<div className="flex flex-col items-center w-full">
		<h2 className="font-semibold mb-2 text-[#170647]">Type de tournoi</h2>
		<select
			className="border border-gray-300 rounded px-3 py-2 text-black w-full text-center"
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
		<div className="flex flex-col w-full max-w-sm mb-6 items-center">
		<label className="text-sm mb-2 text-gray-700">
			Distance maximale :{" "}
			{distance === 300 ? (
			<span className="font-semibold text-[#170647]">Toute la France</span>
			) : (
			<span className="font-semibold text-[#170647]">{distance} km</span>
			)}
		</label>

		<input
			type="range"
			min={1}
			max={300}
			step={1}
			value={distance}
			onChange={(e) => setDistance(Number(e.target.value))}
			className="w-full h-2 accent-[#170647] cursor-pointer"
		/>
		</div>


		{/* Bouton */}
		<button
		onClick={handleSubmit}
		className="bg-[#170647] text-white px-6 py-3 rounded-lg hover:bg-[#2a1085] transition w-full"
		>
		Lancer la recherche
		</button>
	</div>
	</div>
);
}
