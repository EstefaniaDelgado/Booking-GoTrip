import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logoApp.png";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineLogout } from "react-icons/hi";
import {
  MdDashboard,
  MdFavoriteBorder,
  MdOutlineEventAvailable,
} from "react-icons/md";

const Navbar = () => {
  const [userLogin, setUserLogin] = useState(null);
  const [token, setToken] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userGoTrip");
    const userToken = localStorage.getItem("token");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserLogin(parsedUser);
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
        localStorage.removeItem("userGoTrip");
      }
    }

    if (userToken) {
      setToken(userToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userGoTrip");
    localStorage.removeItem("token");
    setUserLogin(null);
    setToken(null);
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 py-3 bg-white left-0 w-full text-black z-50">
      <nav className="container mx-auto px-2 sm:px-1 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            to="/"
            aria-label="Ir a la página principal"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            {/* Logo */}
            {/* <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-white">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div> */}

            <div className="hidden sm:block ml-3">
              <h1 className="text-lg font-bold ">GO TRIP</h1>
              <p className="text-sm text-gray-900">
                ¡Tu aventura comienza aquí!
              </p>
            </div>
          </Link>
        </div>

        {userLogin ? (
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">
              <HiOutlineUser size={25} />
            </span>
            <span className="text-white font-semibold">
              Hola, {userLogin.user.nombre} {userLogin.user.apellido}
            </span>
            <div className="relative">
              <button
                className="bg-gray-200 text-gray-800 font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-300 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userLogin?.user?.nombre?.charAt(0)}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                  <Link
                    to="/profile"
                    className=" flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <HiOutlineUser size={25} />{" "}
                    <span className="pl-2">Mi Perfil</span>
                  </Link>
                  {userLogin.user.role === "ADMIN" && (
                    <Link
                      to="/administracion"
                      className="flex w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <MdDashboard size={25} />{" "}
                      <span className="pl-2">Administración</span>
                    </Link>
                  )}
                  <Link
                    to="/reservas"
                    className="flex w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <MdOutlineEventAvailable size={25} />{" "}
                    <span className="pl-2">Reservas</span>
                  </Link>
                  <Link
                    to="/productos-favoritos"
                    className="flex w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <MdFavoriteBorder size={25} />{" "}
                    <span className="pl-2">Favoritos</span>
                  </Link>

                  <button
                    className="flex block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    <HiOutlineLogout size={25} />{" "}
                    <span className="pl-2">Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center text-black md:text-lg">
            <Link
              to="/login"
              className="px-2 md:px-4 py-2 font-semibold  hover:text-gray-200 transition-colors duration-200"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="px-3 text-sm md:px-6 md:text-lg py-2 bg-sky font-semibold  rounded-3xl hover:bg-[#3da3b1] transition-colors duration-200"
            >
              Regístrate
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
