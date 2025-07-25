import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Login from './pages/Login/Login';
import MainEmployee from './MainEmployee';
import MainSpecialist from './MainSpecialist';
import { getUserFromCookie } from './features/auth/authSlice';
import ScrollToTop from "./components/ScrollToTop";

axios.defaults.baseURL = "http://localhost:4848/api";
axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(getUserFromCookie());
  }, [dispatch]);

  useEffect(() => {
    const html = document.documentElement;

    const fixHtmlScroll = () => {
      if (html.style.overflow === "hidden") {
        html.style.overflowY = "scroll";
        html.style.paddingRight = "0px";
      }
    };

    fixHtmlScroll();

    const observer = new MutationObserver(fixHtmlScroll);
    observer.observe(html, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, []);

  if (loading) return <p>Se încarcă...</p>;

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            user
              ? user.role === 'angajat'
                ? <Navigate to="/employee" />
                : <Navigate to="/specialist" />
              : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/employee/*" element={<MainEmployee />} />
        <Route path="/specialist/*" element={<MainSpecialist />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>

  );
}

export default App;
