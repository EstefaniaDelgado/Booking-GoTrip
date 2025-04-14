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
    <section className="w-[95%] max-w-screen-2xl py-20 md:py-24  mx-auto flex-1 flex flex-col">
      <article className="text-2xl md:text-3xl xl:text-4xl font-semibold text-black p-6 ">
        <div className="mx-auto flex justify-between max-w-screen-2xl">
          Favoritos
          <Link to={'/'}>
            <IoArrowBackCircleOutline size={32} className='hover:scale-105' />
          </Link>
        </div>
      </article>

      <div
        className={`text-center py-5 md:pb-8 font-semibold md:text-xl tracking-wider text-[#3C6E71]`}
      >
        <p className={`${favorites?.length ? 'block' : 'hidden'}`}>
          Tienes {favorites?.length} eventos en tu lista de favoritos.
        </p>
      </div>

      <article className="text-center mx-auto w-full flex-1 flex flex-col justify-center 2xl:justify-start  max-w-screen-2xl">
        {isLoading ? (
          <p>Cargando Favoritos...</p>
        ) : !favorites?.length ? (
          <p>No hay productos favoritos aún</p> 
        ) : (
          <div /* className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full" */ className='grid gap-6 md:grid-cols-2 lg:grid-cols-3' >
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
