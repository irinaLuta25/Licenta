import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";

function TherapistCard({ therapist }) {
  const loggedInUser = useSelector((state) => state.auth.user);
  const basePath = loggedInUser?.role === "specialist" ? "/specialist" : "/employee";

    const user = therapist.user;
    const description = therapist.description;
    const formation = therapist.formation;
    const specialistSpecializations = therapist.specialist_specializations;


  const shortDescription = description
    ? description.length > 100
      ? description.slice(0, 100) + '...'
      : description
    : 'Fără descriere';

  const specializations = specialistSpecializations?.map(s => s.specialization?.name).join(', ');

  return (
    <div className="bg-[#ffe6e0] border border-indigo-300/30 shadow-xl hover:shadow-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] drop-shadow-lg rounded-xl transition transform duration-300 hover:-translate-y-1 overflow-hidden p-4 flex flex-col justify-between">
      <img
        src={user?.profilePicture || "/assets/Cat_November_2010-1a.jpg"}
        alt="Therapist"
        className="w-full max-h-[300px] aspect-[3/4] object-contain rounded-lg mb-4"
      />

      <div>
        <h2 className="text-xl font-semibold text-indigo-800">
          {user?.firstName} {user?.lastName}
        </h2>

        <p className="text-sm mt-1">{shortDescription}</p>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium text-gray-800">Formare:</span> {formation || 'Nespecificat'}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">Specializări:</span> {specializations || 'Nespecificate'}
        </p>
      </div>

      <div className="flex justify-end mt-4">
        <Link
          to={`${basePath}/therapists/${therapist.id}`}
          className="inline-block bg-indigo-700 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-800"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}

export default TherapistCard;