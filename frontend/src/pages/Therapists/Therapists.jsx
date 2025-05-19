import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllTherapists } from "../../features/therapists/therapistsSlice";
import TherapistCard from "../../components/TherapistCard/TherapistCard";
import Navbar from "../../components/Navbar";
import CustomDropdown1 from "../../components/CustomDropdown1";


const sortOptions = [
    { label: "Nume A-Z", value: "name-asc" },
    { label: "Nume Z-A", value: "name-desc" },
];
const genderOptions = [
    { label: "Gen", value: "" },
    { label: "Feminin", value: "feminin" },
    { label: "Masculin", value: "masculin" },
    { label: "Altul", value: "altul" },
];
const formationOptions = [
    { label: "Formare", value: "" },
    { label: "CBT", value: "CBT" },
    { label: "Psihanaliză", value: "Psihanaliză" },
    { label: "Terapie sistemică", value: "Terapie sistemică" },
];

function Therapists() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("name-asc");
    const [genderFilter, setGenderFilter] = useState("");
    const [formationFilter, setFormationFilter] = useState("");

    const dispatch = useDispatch();
    const navigate=useNavigate();

    const therapists = useSelector((state) => state.therapists.list);
    const status = useSelector((state) => state.therapists.status);
    const error = useSelector((state) => state.therapists.error);

    useEffect(() => {
        dispatch(getAllTherapists());
    }, [dispatch]);

    const filteredAndSortedTherapists = [...therapists]
        .filter((t) =>
            `${t.user?.firstName} ${t.user?.lastName} ${t.user?.email}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .filter((t) => {
            if (genderFilter && t.user.gender !== genderFilter) return false;
            if (formationFilter && t.formation !== formationFilter) return false;
            return true;
        })
        .sort((a, b) => {
            const nameA = `${a.user.firstName} ${a.user.lastName}`.toLowerCase();
            const nameB = `${b.user.firstName} ${b.user.lastName}`.toLowerCase();
            if (sortOption === "name-asc") return nameA.localeCompare(nameB);
            if (sortOption === "name-desc") return nameB.localeCompare(nameA);
            return 0;
        });

    if (status === "loading") return <p>Loading...</p>;
    if (status === "failed") return <p>Error: {error}</p>;

    return (
        <>
            <Navbar />
            <div className="pt-24 px-8 sm:px-16 bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
                <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 my-6 mb-12">
                    <div className="flex flex-wrap items-center gap-6 flex-grow">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">

                            <input
                                type="text"
                                placeholder="Search therapist..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gradient-to-r from-[#cbc0f3] via-[#cadbf9] to-[#deecff] text-indigo-800 placeholder:text-indigo-600 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md"
                            />

                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-indigo-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                                    />
                                </svg>

                            </div>
                        </div>

                        {/* Dropdowns */}
                        <CustomDropdown1 value={sortOption} onChange={setSortOption} options={sortOptions} />
                        <CustomDropdown1 value={genderFilter} onChange={setGenderFilter} options={genderOptions} />
                        <CustomDropdown1 value={formationFilter} onChange={setFormationFilter} options={formationOptions} />
                    </div>

                    {/* Compatibility */}
                    <button
                        onClick={() => navigate("compatibilityForm")}
                        className="bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#ec4899] text-white shadow-md hover:brightness-110 hover:scale-105 font-semibold px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2"
                    >
                        <span>✨</span>
                        Compatibility Search
                        <span>✨</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
                    {filteredAndSortedTherapists.map((therapist) => (
                        <TherapistCard key={therapist.id} therapist={therapist} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Therapists;
