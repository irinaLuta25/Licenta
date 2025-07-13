import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";

function TherapistCard({ therapist }) {
  const loggedInUser = useSelector((state) => state.auth.user);
  const basePath = loggedInUser?.role === "specialist" ? "/specialist" : "/employee";

  const user = therapist.user;
  const description = therapist.description;
  const formation = therapist.formation;
  const specialization = therapist.specialization;

  const shortDescription = description
    ? description.length > 100
      ? description.slice(0, 100) + '...'
      : description
    : 'Fără descriere';

  return (
    <div className="bg-gradient-to-br from-[#d4ccff]/70 via-[#c7dfff]/70 to-[#d6e6ff]/70 backdrop-blur-xl shadow-xl hover:shadow-2xl rounded-xl transition transform duration-300 hover:-translate-y-1 overflow-hidden p-4 flex flex-col justify-between">
  <img
    src={user?.profileImage || "/assets/Default_pfp.jpg"}
    alt="Therapist"
    className="w-full max-h-[250px] aspect-[3/4] object-contain rounded-lg mb-4"
  />

  <div>
    <h2 className="text-xl font-semibold text-indigo-800">
      {user?.firstName} {user?.lastName}
    </h2>

    <p className="text-sm mt-1 text-indigo-700">{shortDescription}</p>

    <p className="mt-2 text-sm text-indigo-700">
      <span className="font-medium text-indigo-900">Formare:</span> {formation || 'Nespecificat'}
    </p>

    <p className="text-sm text-indigo-700">
      <span className="font-medium text-indigo-900">Specializare:</span> {specialization || 'Nespecificată'}
    </p>
  </div>

  <div className="flex justify-end mt-4">
    <Link
      to={`${basePath}/therapists/${therapist.id}`}
      className="inline-block bg-indigo-700 text-white text-sm px-4 py-2 rounded-md transition duration-200 hover:bg-indigo-500"
    >
      Vezi mai mult
    </Link>
  </div>
</div>

  );
}

export default TherapistCard;
