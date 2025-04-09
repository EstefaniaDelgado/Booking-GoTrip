import { Link } from 'react-router-dom';
import HeartFavorite from './HeartFavorite';
import { FaLocationDot } from 'react-icons/fa6';
import { FaStar } from 'react-icons/fa';

const RecomendadosCard = ({ event, favorites, setFavorites }) => {
  return (
    <div className="mx-auto w-[296px] lg:w-[300px] rounded-lg shadow-lg border-gray-300 overflow-hidden flex flex-col border-2">
      <div className="bg-gray-200 h-40 relative">
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
        <div className="h-full md:w-full p-4 flex flex-col justify-between ">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl text-gray-800 font-medium">{event.name}</h3>
          </div>

          <div className='flex  justify-between items-center'>
            <div className="text-sm text-gray-600 line-clamp-4 flex items-center gap-1">
              <FaLocationDot className="fill-gray-600 text-lg " />
              <span>{event.country},</span>
              <span>{event.city}</span>
            </div>
            <div className='bg-teal-600 px-2 py-1 rounded-full flex items-center gap-2'>
              <FaStar className="text-yellow-400 text-lg" />
              <span>3.0</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default RecomendadosCard;
