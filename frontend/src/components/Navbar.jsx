import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useEffect } from 'react';
import { getEmployeeByUserId } from '../features/employee/employeeSlice';

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

  useEffect(() => {
    if (user?.role == "angajat") {
      dispatch(getEmployeeByUserId(user?.id))
    }
  }, [dispatch, user])

  const role = user?.role;
  const basePath = role === "specialist" ? "/specialist" : "/employee";

  const navLinks = [];

  if (role === "specialist") {
    navLinks.push(
      { label: "ACASĂ", path: `${basePath}/home` },
      { label: "EVENIMENTE", path: `${basePath}/events` },
      { label: "CLIENȚI", path: `${basePath}/clients` },
      { label: "PROGRAM", path: `${basePath}/schedule` },
      { label: "PROFIL", path: `${basePath}/profile` },
    );
  } else {
    navLinks.push(
      { label: "ACASĂ", path: `${basePath}/home` },
      { label: "TERAPEUȚI", path: `${basePath}/therapists` },
      { label: "EVENIMENTE", path: `${basePath}/events` },
      { label: "PROGRAM", path: `${basePath}/schedule` },
      { label: "ECHILIBRU PERSONAL", path: `${basePath}/wellbeing` },
      { label: "PROFIL", path: `${basePath}/profile` }
    );
    if (employee?.isManager) {
      navLinks.push({ label: "RAPOARTE", path: `${basePath}/reports` });
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-700 text-white px-6 py-3 pb-4 flex justify-between items-center shadow-md">

      <div
        className="text-3xl font-extrabold bg-gradient-to-r from-[#c1f7dc] via-[#b2d8f3] to-[#c7b5ff] text-transparent bg-clip-text"
        style={{ fontFamily: "'Syne', sans-serif" }}
      > 
        MindCare
      </div>


      <ul className="hidden md:flex space-x-10">
        {navLinks.map(({ label, path }) => {
          const isActive = location.pathname.includes(path);
          return (
            <li key={label}>
              <Link
                to={path}
                className={`transition duration-200 ${isActive
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
        <span className="text-md">Deconectare</span>
      </button>
    </nav>
  );
}

export default Navbar;
