import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedBookingRoute = () => {
    const [auth, setAuth] = useState(() => {
      const userData = JSON.parse(localStorage.getItem("userGoTrip") || "{}");
      return {
        token: userData?.token,
        role: userData?.user?.role,
      };
    });
  
    useEffect(() => {
      const handleStorageChange = () => {
        const userData = JSON.parse(localStorage.getItem("userGoTrip") || "{}");
        setAuth({
          token: userData?.token,
          role: userData?.user?.role,
        });
      };
  
      window.addEventListener("storage", handleStorageChange);
      const observer = setInterval(handleStorageChange, 1000);
  
      return () => {
        window.removeEventListener("storage", handleStorageChange);
        clearInterval(observer);
      };
    }, []);
  
    if (!auth.token) return <Navigate to="/login" replace />;
    if (auth.role !== "ADMIN" && auth.role !== "CLIENT") return <Navigate to="/" replace />;
  
    return <Outlet />;
  };
  
  export default ProtectedBookingRoute;
  