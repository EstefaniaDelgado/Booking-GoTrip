import fotoImage from '../assets/imagen-default.jpg';
import imgDefault1 from '../assets/imgDefault1.jpg';
import imgDefault2 from '../assets/imgDefault2.jpg';
import imgDefault3 from '../assets/imgDefault3.jpg';
import { useState, useEffect, useRef } from 'react';
import RecomendadosHome from '../views/Home/components/RecomendadosHome';
import { useNavigate } from 'react-router-dom';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Header from './Header';
import Spinner from './Spinner/Spinner';
import GlobalWhatsAppContactButton from '../views/Home/components/GlobalWhatsAppContactButton';
import { Chip } from '@material-tailwind/react';
import { FaAngleLeft } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa';
import SkeletonCategoryCard from './SkeletonCategoryCard';

const Body = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const defaultImages = [imgDefault1, imgDefault2, imgDefault3];
  const scrollRef = useRef(null);
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
      .catch((error) => console.error('Error obteniendo categorías:', error));
  }, []);

  useEffect(() => {
    if (categories.length && scrollRef.current) {
      setTimeout(updateScrollButtons, 100);
    }
  }, [categories]);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      const isOverflowing = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(isOverflowing && el.scrollLeft > 0);
      setCanScrollRight(
        isOverflowing && el.scrollLeft + el.clientWidth < el.scrollWidth - 1
      );
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Evaluar inmediatamente al montar
    updateScrollButtons();

    el.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const handleCategoryClick = (id_category) => {
    if (id_category == null) {
      console.error('No se pudo encontrar un ID de categoría válido');
      return;
    }
    navigate(`/Category?filter=${id_category}`);
  };

  const getRandomDefaultImage = () => {
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 300);
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 300);
  };

  return (
    <div>
      <section>
        <Header />
      </section>

      <section className="w-full ">
        <div className="mx-auto px-3 md:px-10  w-full max-w-screen-2xl">
          <section className=" mb-12 mt-7">
            <div className="relative">
              <h2 className="secondHeaders">Categorías</h2>
              <h4 className="subtitles mb-6 md:mb-10 lg:pt-1">
                Explora todas nuestras categorías.
              </h4>

              {/* Botones SIEMPRE visibles */}
              <button
                className={`absolute p-1 md:p-2 xl:p-3 top-0 md:bottom-0 md:top-auto right-12 xl:right-14 z-10 rounded-full shadow transition-opacity ${
                  canScrollLeft
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                }`}
                onClick={scrollLeft}
                disabled={!canScrollLeft}
              >
                <FaAngleLeft />
              </button>
              <button
                className={`absolute right-2 top-0 md:bottom-0 p-1 md:p-2 xl:p-3 md:top-auto z-10 rounded-full shadow transition-opacity ${
                  canScrollRight
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                }`}
                onClick={scrollRight}
                disabled={!canScrollRight}
              >
                <FaAngleRight />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex overflow-x-hidden gap-2 scrollbar-hide snap-x snap-mandatory"
            >
              {!categories.length
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonCategoryCard key={index} />
                  ))
                : categories.map((category) => (
                    <div
                      className="relative h-64 w-[296px] flex-shrink-0 rounded-lg overflow-hidden shadow-sm cursor-pointer"
                      key={category.id_category}
                      onClick={() => handleCategoryClick(category.id_category)}
                    >
                      <div className="h-full w-full">
                        <img
                          src={category.imageUrl || getRandomDefaultImage()}
                          alt={category.name}
                          className="relative w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 p-3  left-1/2 transform -translate-x-1/2  text-white z-30">
                        <Chip
                          value={category.name}
                          className=" bg-white/50 rounded-full text-white"
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </section>
        </div>

        <section className="py-6 w-full bg-gray-100">
          <article className=" px-3 md:px-10"><h2 className="secondHeaders">Recomendaciones</h2>
          <h4 className="subtitles md:mb-4 lg:pt-1">
            Descubre todos los eventos que tenemos para ti.
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="col-span-1 sm:col-span-2 my-10">
              <RecomendadosHome />
            </div>
          </div></article>
        </section>
      </section>

      <GlobalWhatsAppContactButton message="Estoy interesado en explorar los eventos de la plataforma. ¿Pueden ayudarme con unas dudas?" />
    </div>
  );
};

export default Body;
