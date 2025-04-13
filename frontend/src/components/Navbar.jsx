import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-indigo-600">
        MindCare
      </div>

      <ul className="hidden md:flex space-x-6 font-medium text-gray-700">
        <li>
          <Link
            to="/employee/therapists"
            className={`hover:text-indigo-600 ${location.pathname.includes("/therapists") ? "text-indigo-600 font-semibold" : ""
              }`}
          >
            Therapists
          </Link>
        </li>

        <li>
          <Link to="/employee/events"
            className={`hover:text-indigo-600 ${location.pathname.includes("/events") ? "text-indigo-600 font-semibold" : ""
              }`}
          >
            Events
          </Link>
        </li>
        <li>

          <Link
            to="/employee/habits"
            className={`hover:text-indigo-600 ${location.pathname.includes("/employee/habits") ? "text-indigo-600 font-semibold" : ""
              }`}
          >
            Habits
          </Link>
        </li>

        <li>
          <Link
            to="/employee/calendar"
            className={`hover:text-indigo-600 ${location.pathname.includes("/employee/calendar") ? "text-indigo-600 font-semibold" : ""
              }`}
          >
            Calendar
          </Link>
        </li>

        <li>
          <Link
            to="/employee/profile"
            className={`hover:text-indigo-600 ${location.pathname.includes("/employee/profile") ? "text-indigo-600 font-semibold" : ""
              }`}
          >
            Profile
          </Link>
        </li>
      </ul>

      <button
        onClick={handleLogout}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm md:text-base"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
