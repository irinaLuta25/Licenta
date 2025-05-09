import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const employee = useSelector((state) => state.employee.employee);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const role = user?.role;
  const basePath = role === "specialist" ? "/specialist" : "/employee";

  const navLinks = [];

  if (role === "specialist") {
    navLinks.push(
      { label: "Events", path: `${basePath}/events` },
      { label: "Therapists", path: `${basePath}/therapists` },
      { label: "My Schedule", path: `${basePath}/schedule` },
      { label: "Profile", path: `${basePath}/profile` }
    );
  } else {
    navLinks.push(
      { label: "Therapists", path: `${basePath}/therapists` },
      { label: "Events", path: `${basePath}/events` },
      { label: "My Schedule", path: `${basePath}/schedule` },
      { label: "Habits", path: `${basePath}/habits` },
      { label: "Profile", path: `${basePath}/profile` }
    );
    if (employee?.isManager) {
      navLinks.push({ label: "Reports", path: `${basePath}/reports` });
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-700 text-white px-6 py-3 pb-4 flex justify-between items-center shadow-md">

      <div className="text-2xl font-bold">MindCare</div>

      <ul className="hidden md:flex space-x-6">
        {navLinks.map(({ label, path }) => {
          const isActive = location.pathname.includes(path);
          return (
            <li key={label}>
              <Link
                to={path}
                className={`transition duration-200 ${
                  isActive
                    ? "underline font-semibold text-white"
                    : "text-white hover:text-indigo-300"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-white px-3 py-1.5 rounded-md hover:bg-indigo-600 hover:border-indigo-300 transition duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9v1" />
        </svg>
        <span className="text-sm">Logout</span>
      </button>
    </nav>
  );
}

export default Navbar;
