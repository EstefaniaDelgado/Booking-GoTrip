import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CategoryTable from "./Category/CategoryTable";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const apiUrl =
      import.meta.env.VITE_API_URL_DEVELOPMENT ||
      import.meta.env.VITE_API_URL_PRODUCTION;
    axios
      .get(`${apiUrl}/categorias`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  return (
    <>
      <section className="w-full max-w-[898px] mx-auto pt-4">
        <div className="flex flex-row-reverse justify-self-start gap-2">
          <h2 className="text-4xl font-semibold tracking-wide">
            Tabla de Categoria
          </h2>
        </div>
        <button className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-all mb-6">
          <Link to="/administracion/administrar-categorias">
            Agregar Categoria
          </Link>
        </button>
      </section>
      <div className="max-w-2xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg"></div>
      <CategoryTable />
    </>
  );
};

export default CategoryList;
