import React from 'react';
import { Link } from 'react-router-dom';
import  HeartFavorite from './HeartFavorite';

const RecomendadosCard = ({ event, favorites, setFavorites }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row md:h-[160px]">
      {/* <div className="sm:w-1/3 bg-gray-200 h-48 sm:h-40 flex-shrink-0 relative"> */}
      <div className="sm:w-1/3 bg-gray-200 h-40 md:h-full flex-shrink-0 relative">
        <HeartFavorite event={event} favorites={favorites} setFavorites={setFavorites}/>
        <img
          src={event.images[0]} 
          alt={event.name}
          className="block w-full h-full object-cover"
        />
      </div>
      <Link
        to={`/Detail/${event.id}`} /* className="flex flex-col sm:flex-row" */
      >
        {/* <div className="sm:w-2/3 p-4 flex flex-col justify-between"> */}
        <div className="sm:w-2/3 md:w-full p-4 flex flex-col justify-center h-full">
          <div className='text-start'>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-700 font-medium">{event.name}</h3>
            </div>
            <div className="text-sm text-gray-600 line-clamp-4">
              <span>{event.description}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default RecomendadosCard;
