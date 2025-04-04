import { useEffect, useState } from 'react';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router';
import RecomendadosCard from './Home/components/RecomendadosCard';
import { getFavoritesProducts } from '../services/favoritesServie';
import GlobalWhatsAppContactButton from './Home/components/GlobalWhatsAppContactButton';

const FavoritesProducts = () => {
  
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem('userGoTrip')) || {};
  const idUser = storedUser?.user?.id;

  useEffect(() => {
    const fecthApi = async () => {
      try {
        const data = await getFavoritesProducts(idUser);
        setFavorites(data);
      } catch (error) {
        console.log('Ha ocurrido un error al intentar traer favoritos', error);
      } finally {
        setIsLoading(false);
      }
    };
    fecthApi();
  }, [idUser]);

  return (
    <section className="flex-1 flex flex-col">
      <article className="bg-sky text-white font-medium text-2xl p-6 mt-10 ">
        <div className="mx-auto flex justify-between max-w-screen-2xl">
          Favoritos
          <Link to={'/'}>
            <IoArrowBackCircleOutline size={30} />
          </Link>
        </div>
      </article>

      <div
        className={`text-center py-5 font-semibold md:text-xl tracking-wider text-gray-500`}
      >
        <p className={`${favorites?.length ? 'block' : 'hidden'}`}>
          Tienes {favorites?.length} eventos en tu lista de favoritos.
        </p>
      </div>

      <article className="text-center mx-auto flex-1 flex flex-col justify-center 2xl:justify-start pt-5 pb-10 px-10 xl:px-0 max-w-screen-2xl">
        {isLoading ? (
          <p>Cargando Favoritos...</p>
        ) : !favorites?.length ? (
          <p>No hay productos favoritos aún</p> 
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {favorites.map((favorite) => (
              <RecomendadosCard
                key={`item-event${favorite.id}`}
                event={favorite}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ))}
          </div>
        )}
      </article>
      <GlobalWhatsAppContactButton 
        message="Quiero saber más sobre mis favoritos.¿Pueden ayudarme?"
      />
    </section>
  );
};

export default FavoritesProducts;
