import { Link } from 'react-router-dom';

function TherapistCard({ therapist }) {

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
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col justify-between bg-indigo-400">
      <img
        src={user?.profilePicture || "/assets/Cat_November_2010-1a.jpg"}
        alt="Therapist"
        className="w-full max-h-[300px] aspect-[3/4] object-contain rounded-md mb-4"
      />

      <div>
        <h2 className="text-xl font-semibold text-indigo-700">
          {user?.firstName} {user?.lastName}
        </h2>

        <p className="text-gray-600 text-sm mt-1">{shortDescription}</p>

        <p className="mt-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">Formare:</span> {formation || 'Nespecificat'}
        </p>

        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Specializări:</span> {specializations || 'Nespecificate'}
        </p>
      </div>

      <div className="mt-4">
        <Link
          to={`/employee/therapists/${therapist.id}`}
          className="inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}

export default TherapistCard;