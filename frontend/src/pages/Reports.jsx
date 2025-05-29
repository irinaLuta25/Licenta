import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MoodEvolutionChart from "../components/Charts/MoodEvolutionChart";
import { useSelector } from "react-redux";

function Reports() {
  const { user } = useSelector((state) => state.auth);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2024);

  return (
    <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen text-gray-800">
      <Navbar />

      <div className="px-6 py-24">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-800">
          Raport pentru departamentul HR
        </h1>

        {/* Filtre */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">
              Selectează luna:
            </label>
            <select
              className="px-4 py-2 rounded bg-white shadow"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              <option value={1}>Ianuarie</option>
              <option value={2}>Februarie</option>
              <option value={3}>Martie</option>
              <option value={4}>Aprilie</option>
              <option value={5}>Mai</option>
              <option value={6}>Iunie</option>
              <option value={7}>Iulie</option>
              <option value={8}>August</option>
              <option value={9}>Septembrie</option>
              <option value={10}>Octombrie</option>
              <option value={11}>Noiembrie</option>
              <option value={12}>Decembrie</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Selectează anul:
            </label>
            <select
              className="px-4 py-2 rounded bg-white shadow"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>

        {/* Secțiune: Stare emoțională */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Stare emoțională</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
              <MoodEvolutionChart
                managerId={user?.id}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </div>

            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
              G2: BarChart - Frecvență emoții
            </div>
          </div>
        </section>

        {/* Secțiune: Probleme raportate */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Probleme raportate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
              G3: LineChart - Probleme în timp
            </div>
            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)] max-h-64 overflow-y-auto">
              <p className="font-medium mb-2">Probleme comunicate:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Stres cauzat de volum de muncă</li>
                <li>Așteptări neclare</li>
                <li>Lipsă de comunicare</li>
                <li>...</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Secțiune: Participare la evenimente */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Participare la evenimente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
              G4: PieChart - Tipuri de evenimente preferate
            </div>
            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
              G5: LineChart - Participare în timp
            </div>
          </div>
        </section>

        {/* Secțiune opțională: Obiective și echilibru emoțional */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Obiective & echilibru emoțional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
              G6: RadarChart - Obiective personale
            </div>
            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
              G7: ScatterChart - Obiective vs. mood
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
