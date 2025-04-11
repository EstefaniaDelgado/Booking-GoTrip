import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CategoryTable from './Category/CategoryTable';
import { LuTable2 } from 'react-icons/lu';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const apiUrl =
      import.meta.env.VITE_API_URL_DEVELOPMENT ||
      import.meta.env.VITE_API_URL_PRODUCTION;
    axios
      .get(`${apiUrl}/categorias`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error al obtener categorías:', error));
  }, []);

  return (
    <section className="w-full max-w-[898px] mx-auto pt-4">
      <div className=" flex flex-row-reverse justify-self-start gap-2">
        <h2 className="text-4xl font-semibold tracking-wide">
          Tabla de Categorías Creadas
        </h2>
        <LuTable2 size={40} />
      </div>
      <p className="text-platinum my-5">Mira más información sobre las Categorías de los eventos.</p>
      <button className="bg-sky text-white font-light py-2 px-4 rounded-lg hover:bg-sky/80 transition-all mb-6">
        <Link to="/administracion/administrar-categorias">
          Agregar Categoría
        </Link>
      </button>
      <CategoryTable />
    </section>
  );
};

export default CategoryList;
