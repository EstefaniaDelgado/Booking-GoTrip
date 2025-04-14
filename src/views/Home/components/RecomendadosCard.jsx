import { Link } from 'react-router-dom';
import HeartFavorite from './HeartFavorite';
import { FaLocationDot } from 'react-icons/fa6';
import { FaStar } from 'react-icons/fa';
import { Chip } from '@material-tailwind/react';

const RecomendadosCard = ({ event, favorites, setFavorites }) => {
  const categoryColors = {
    conciertos: 'red',
    festivales: 'green',
    eventos: 'blue',
    conferencias: 'purple',
    congresos: 'amber',
    desfiles: 'pink',
    viajes: 'teal',
  };

  const categoryName = event?.categoryOutputDTO?.name.toLowerCase().trim();
  const chipColor = categoryColors[categoryName] || 'gray';

  return (
    <div className="mx-auto w-[290px] lg:w-[300px] rounded-lg shadow-lg border-gray-300 overflow-hidden flex flex-col border-2">
      <div className="relative bg-gray-200 h-40">
        <Chip
          className="absolute top-2 left-2 rounded-full"
          color={chipColor}
          value={event?.categoryOutputDTO?.name}
        />
         <HeartFavorite
          event={event}
          favorites={favorites}
          setFavorites={setFavorites}
        />
        <img
          src={event.images[0]}
          alt={event.name}
          className="block w-full h-full  object-cover"
        />
      </div>
      <Link to={`/Detail/${event.id}`} className="flex-1 bg-white">
        <div className="relative h-full md:w-full p-4 flex flex-col justify-between ">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl text-gray-800 font-medium">{event?.name}</h3>
          </div>

          <div className="flex  justify-between items-center">
            <div className="text-sm text-gray-600 line-clamp-4 flex items-center gap-1">
              <FaLocationDot className="fill-sky text-lg " />
              <span>{event?.country},</span>
              <span>{event?.city}</span>
            </div>
            <div className="bg-teal-600 px-2 py-1 rounded-full flex items-center gap-2">
              <FaStar className="text-yellow-400 text-lg" />
              <span className="text-white">3.0</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default RecomendadosCard;
