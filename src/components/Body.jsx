import fotoImage from "../assets/imagen-default.jpg";
import imgDefault1 from "../assets/imgDefault1.jpg";
import imgDefault2 from "../assets/imgDefault2.jpg";
import imgDefault3 from "../assets/imgDefault3.jpg";
import { useState, useEffect } from "react";
import RecomendadosHome from "../views/Home/components/RecomendadosHome";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Header from "./Header";
import Spinner from "./Spinner/Spinner";
import GlobalWhatsAppContactButton from "../views/Home/components/GlobalWhatsAppContactButton";

const Body = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl =
      import.meta.env.VITE_API_URL_DEVELOPMENT ||
      import.meta.env.VITE_API_URL_PRODUCTION;
    fetch(`${apiUrl}/categorias`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })

      .catch((error) => console.error("Error obteniendo categorías:", error));
  }, []);

  const handleCategoryClick = (id_category) => {
    if (id_category == null) {
      console.error("No se pudo encontrar un ID de categoría válido");
      return;
    }
    navigate(`/Category?filter=${id_category}`);
  };

  const defaultImages = [imgDefault1, imgDefault2, imgDefault3];

  const getRandomDefaultImage = () => {
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <section className="relative w-full bg-cover bg-center">
        <Header />
      </section>

      <section className="mx-auto w-full max-w-screen-2xl">
        <section className="mb-12 mx-10 mt-7">
          <h2 className="text-2xl lg:text-4xl xl:text-5xl font-medium text-gray-700 ">
            Categorías
          </h2>
          <h4 className='text-gray-500 mb-6 md:mb-10 lg:text-xl lg:pt-1'>Explora todas nuestras categorías.</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:flex-nowrap gap-4">
            {!categories.length ? (
              <div className="h-[248px]  flex justify-center items-center md:col-span-3 lg:col-span-5">
                <Spinner />
              </div>
            ) : (
              categories.map((category) => (
                <div
                  className="rounded-lg overflow-hidden shadow-sm cursor-pointer"
                  key={category.id_category}
                  onClick={() => handleCategoryClick(category.id_category)}
                >
                  <div className="bg-gray-200 h-48 w-full">
                    <img
                      src={category.imageUrl || getRandomDefaultImage()}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="text-gray-700 font-medium">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="py-6 mx-10">
          <h2 className="text-2xl lg:text-4xl xl:text-5xl font-medium text-gray-700 ">
            Recomendaciones
          </h2>
         <h4 className='text-gray-500 md:mb-4 lg:text-xl lg:pt-1'>Descubre todos los eventos que tenemos para ti.</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="col-span-1 sm:col-span-2 my-10 ">
              <RecomendadosHome />
            </div>
          </div>
        </section>
      </section>
      <GlobalWhatsAppContactButton message="Estoy interesado en explorar los eventos de la plataforma. ¿Pueden ayudarme con unas dudas?" />
    </div>
  );
};

export default Body;
