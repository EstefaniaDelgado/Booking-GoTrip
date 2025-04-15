import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { useContext } from 'react';
import { EventContext } from '../context/ProductContext';
import { IoSearch } from 'react-icons/io5';
import { FaRegCalendarAlt } from 'react-icons/fa';
import Plane from '../assets/plane.png';
import { getCategories } from '../services/categoryService';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { events, fetchEvents } = useContext(EventContext);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const calendarRef = useRef(null);
  const apiUrl =
    import.meta.env.VITE_API_URL_DEVELOPMENT ||
    import.meta.env.VITE_API_URL_PRODUCTION;

  useEffect(() => {
    fetchEvents();
  }, []);

  const truncateDescription = (description, wordLimit = 9) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  useEffect(() => {
    const fecthApi = async () => {
         try {
           const data = await getCategories();
           setCategories(data);
         } catch (error) {
           console.log('Ha ocurrido un error al intentar traer categorias', error);
         } 
        }
        fecthApi()
  }, []);

  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ]);

  const [calendarConfig, setCalendarConfig] = useState({
    months: 2,
    direction: 'horizontal',
  });

  useEffect(() => {
    const updateCalendarConfig = () => {
      if (window.innerWidth < 1024) {
        setCalendarConfig({ months: 2, direction: 'vertical' });
      } else {
        setCalendarConfig({ months: 2, direction: 'horizontal' });
      }
    };

    updateCalendarConfig();
    window.addEventListener('resize', updateCalendarConfig);

    return () => window.removeEventListener('resize', updateCalendarConfig);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setDestination(value);

    if (value) {
      const filteredSuggestions = events.filter((event) =>
        event.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    let query = `?name=${destination}`;

    if (dateRange[0].startDate && dateRange[0].endDate) {
      query += `&startDate=${format(
        dateRange[0].startDate,
        'yyyy-MM-dd'
      )}&endDate=${format(dateRange[0].endDate, 'yyyy-MM-dd')}`;
    }
    navigate(`/category${query}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setSuggestions([]);
      }

      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="min-h-screen bg-hero bg-no-repeat bg-cover bg-center">
      <div className=" h-screen relative z-30 mx-auto max-w-screen-2xl">
        <img
          src={Plane}
          alt="plane"
          className="absolute top-1/2 -translate-y-1/2 left-1/2 transform -translate-x-1/2 -z-10 h-[300px] xl:h-[500px]"
        />
        <div className="h-full md:pt-3 lg:pt-0  md:px-10 lg:px-20 xl:px-10 flex flex-col items-center justify-center md:items-start gap-10 ">
          {/* Caja del título */}
          <div className="space-y-2 tracking-wide px-6 md:px-0 text-black w-full ">
            <h1 className="text-4xl text-center capitalize font-semibold md:text-left md:text-7xl xl:text-8xl md:w-11/12 ">
              Descubre tu próxima{' '}
              <span className="relative w-full">
                aventura
                <span className="absolute left-0  xl:bottom-2 fill-orange-400 -z-10">
                  <svg
                    className="w-full"
                    height="62.1px"
                    enableBackground="new 0 0 366 62.1"
                    viewBox="0 0 366 62.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="fill-warning"
                      d="m322.5 25.3c0 1.4 2.9 0.8 3.1 1.6 0.8 1.1-1.1 1.3-0.6 2.4 13.3 0.9 26.9 1.7 40.2 4-2.5 0.7-4.9 1.6-7.3 1.1-4-0.9-8.2-1-12.2-1.2-8.5-0.5-16.9-1.9-25.5-1.7h-3.1c2.6 0.6 4.8 0.4 5.7 2.2-7.3 0.4-14.1-0.8-21.2-1.1-0.2 0.6-0.5 1.2-0.8 1.8 21.3 0.7 42.5 1.6 64.3 4.6-4.2 1.6-7.7 1-10.8 0.8-6.8-0.5-13.5-1.3-20.3-1.9-0.9-0.1-2.3-0.1-2.9 0.2-2.2 1.6-4.3 0.6-7 0.4 1.4-1 2.5 0.5 3.9-0.8-5.6-1-10.7 0.6-15.9 0s-10.5-0.6-16.6-0.8c2 1.6 4.6 1.3 6.2 1.4 4.9 0 9.9 0.8 14.8 0.7 5.3-0.1 10.4 0.5 15.5 0.9 3.2 0.3 6.7-0.1 9.9-0.4 1.1-0.1 0.5 0.3 0.6 0.6 0.5 0.9 2.2 0.8 3.6 0.8 5.1-0.1 10.1 0.6 14.8 1.5 0.8 0.1 1.5 0 1.7 0.7 0 0.7-0.8 0.6-1.5 0.8-3.9 1.2-7.4-0.2-11.1-0.2-2 0-4.3-1.5-6 0.5-0.3 0.4-1.4 0.1-2.2-0.1-4.5-0.8-9.1-0.5-13.8-1.5-2.3-0.5-5.6 0.1-8.4 0.5-4 0.5-8-0.7-12.1-0.9-3.4-0.2-7.1-0.5-10.5-0.7-7.1-0.3-14.2-1.2-22.3-0.4 4.9 1.1 9.4 1.2 13.8 1.2 9.7 0 19.2 2.3 28.9 1.6 7.3 3.2 15.9 1.5 23.8 2.9 4.9 0.8 10.1 0.8 15.2 1.2 0.5 0 0.8 0.3 1.1 0.9-20-2.1-40.2-1.4-60.8-3 4.9 2.1 10.8-0.3 15.3 2.7-8 1.9-15.8-0.9-23.5-0.1 2.8 1.4 7.1 1.1 9.3 3.3 0.5 0.5 0.2 1.1-1.2 1.3 2.3 1 3.4-2.1 5.7-0.4 0.2-0.6 0.2-1 0.3-1.5 0.8-0.3 2 0.8 1.5 1.5-0.2 0.1 0 0.3 0 0.5 18.7 0.4 37.3 1.7 56.2 3.6-1.7 1.1-2.8 1.2-4.2 1.1-7.1-0.5-14.1-0.9-21.2-1.4-3.1-0.2-6.3-0.4-9.4-0.4-7.6-0.2-15-0.7-22.4-1-9-0.4-17.9-0.1-26.9-0.1-1.2 0-2.9-0.4-3.9 1 14.8 0.3 29.7 0.6 44.4 1.1 14.8 0.6 29.9 1.3 44.2 4.2-4.3 1-8.8 0.9-13 0.5-5.3-0.5-10.5-1.1-15.8-1.2-11.4-0.3-22.9-0.9-34.3-1.2-17.6-0.4-35.4-0.3-53.1-0.4-10.8-0.1-21.7-0.2-32.5 0-17.8 0.4-35.7 0.2-53.5 0.5-13.1 0.3-26.3 0.1-39.4 0.5-11.1 0.3-22.4 0.6-33.6 1-13.1 0.6-26.1 0.2-39.3 0.4-3.9 0.1-7.6 0.2-11.8-0.2 0.9-1.2 2.3-1.3 3.9-1.3 8.4 0.2 16.6-0.4 24.9-0.9 3.9-0.2 7.9-0.4 11.9 0.2 2.5 0.4 5.3-0.3 8-0.4 7.3-0.4 14.7-0.7 22-0.9 11.9-0.5 23.7-1.2 35.6-0.8 7.7 0.2 15.3-0.6 22.9-0.1 2.3 0.2 4.3-0.5 6.5-1h-17.6c-9.6 0-19-0.1-28.6 0-8 0.1-16.1 0.3-24 0.8-2.6 0.2-5.4 0.1-8.2 0.1-10.1 0.3-20.1 0.6-30.2 0.5-5.4 0-10.7-0.1-15.9 0.6-2.3 0.3-4-1.3-6.5-0.6 0.2 0.4 0.5 0.9 0.6 1.5-1.9 0-4 0.4-4.9-0.1-4.2-2.2-9.4-1.5-14.1-2.3-1.7-0.3-3.7-0.1-4.3-1.5-0.5-1.3 1.9-1.5 2.6-2.6-4.2-1.4-4.6-5-8.5-7.2-1.5 0.2-0.9 2.8-4.2 1.3 0.3 2.4 4.5 3.9 2.8 6.4-2.3 0.3-3.2-0.8-4.2-1.7-2.5-4-5.1-8.4-5.1-12.7 0.2-6.8 0.2-13.8 3.6-20.4 0.3-0.5 0.3-1 0.8-1.4 0.9-0.9 1.2-2.4 3.6-2.1 2.2 0.2 2.5 1.5 2.6 2.6 0.2 1.4 1.5 1.8 3.2 2.5 0.9-1.4 0.5-2.9 2.6-3.7 0.2-0.1 0.3-0.4 0.3-0.4-3.1-2.2 1.2-2.2 2.3-3.3-3.1-1.8-4-4.3-3.7-7-1.5-0.3-3.1-0.4-4.5 0-1.7 0.6-2.2-0.5-2.9-1 0.6-0.5 0.8-1.1 2.2-1.3 7.6-0.9 15.2-1.7 22.9-2 20-0.7 39.9-0.9 59.9-1 11.9-0.1 23.8 0.4 35.6 1.1 3.6 0.2 7.1-0.9 10.7-0.5 7.9 0.9 15.8 0.3 23.8 0.5 7.3 0.1 14.4-0.6 21.7-0.1 12.2 0.9 24.4 0.3 36.7 0.6 9.4 0.3 18.9 0.4 28.2 1 11.9 0.7 23.8 1.3 35.6 2 11.1 0.6 22.4 0.5 33.3 2 7.1 1 14.4 1.1 21.3 2.4 4 0.7 8.2 1.6 12.4 1.9 2.2 0.2 0.9 1 1.5 1.5-4-0.8-8-0.8-12.1-1.4-4.3-0.7-8.5-1-12.8 0.4-2.9 1-6.3 0.2-9.3-0.1-10.2-1.1-20.6-1.6-30.8-2.4-12.1-0.9-24.3-1.4-36.4-2.1-9.9-0.6-20-0.5-29.9-1-11.4-0.6-22.7 0-34.2-0.5-6.3-0.3-12.3-0.3-18.5-0.4-4.2-0.1-8.4 1.3-12.8 0.3 0.6 0.2 1.2 0.7 1.9 0.7 10.5 0 20.9 1.9 31.6 1.7 6.5-0.1 13.1 0.2 19.8 0.8 3.2 0.3 6.3-0.4 9.7-0.1 7.6 0.7 15.5 0.5 23 0.8 12.4 0.5 24.7 0.4 37.1 1.1 13.3 0.7 26.8 2.1 39.9 4.1 6.2 0.9 12.7 1.5 19.2 1.7 0.6 0 1.1 0.1 1.5 0.5-4.6 0.1-9.3 0-13.9-0.5-0.6 1.1 1.4 0.9 1.5 1.9-9.7 1.6-19.6-1.4-29.4-0.1 2.2 1.4 5.1 1 7.4 1 7.3 0.1 14.1 1.3 21.2 1.9 2.8 0.3 5.9 0 8.5 0.8 1.5 0.5 4.6-1.1 4.9 1.3 4-0.7 7.3 1.5 11.1 1.2 4-0.3 7.7 0.6 11.6 1.1 0.8 0.1 2.2 0.3 2.3 1.1 0.2 1-1.1 1.2-2 1.5-3.4 1-6.7-0.4-10.1-0.4-0.9 0-2-0.2-2.9-0.2-9.4 0.1-18.8-1.3-28.3-1.8-6-0.4-12.1-0.9-18.1-1.3 0 0.2 0 0.4-0.2 0.6 6.1 0.5 12.1 1.4 18.3 0.7z"
                    />
                  </svg>
                </span>
              </span>
            </h1>

            <h2 className="subtitles text-center  md:text-left">
              Encuentra las mejores ofertas para tus eventos favoritos...
            </h2>
          </div>

          {/* Contenedor con buscador, calendario y categorías */}
          <div className="flex flex-col gap-5 px-2">
            {/* Buscador */}
            <div className="bg-white w-full mx-auto  text-black/70 rounded-lg shadow-lg flex items-center p-2 px-3 min-h-[48px] hover:border-gray-400 hover:border-2">
              <IoSearch className="text-xl text-gray-700" />
              <input
                type="text"
                placeholder="Nombre del evento..."
                value={destination}
                onChange={handleSearchChange}
                className="px-2 focus:outline-none placeholder:text-gray-400"
                ref={inputRef}
              />
            </div>

            {/* Sugerencias del campo de búsqueda */}
            {destination && suggestions.length > 0 && (
              <div
                className="absolute  border rounded-lg  mt-[60px] shadow-lg z-10 bg-white text-gray-900"
                ref={suggestionsRef}
              >
                <ul className="max-h-60 overflow-y-auto rounded-lg">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
                      onClick={() => {
                        setDestination(suggestion.name);
                        setSuggestions([]);
                      }}
                    >
                      <div className="text-lg font-bold text-gray-800">
                        {suggestion.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {truncateDescription(suggestion.description)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="w-full px-2 md:px-0 flex text-sm gap-3 ">
              {/* Calendario */}
              <div ref={calendarRef}>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full h-full bg-white text-gray-400 rounded-lg px-4 py-2 shadow-lg flex items-center  gap-3 transition-colors font-light "
                >
                  <FaRegCalendarAlt className="text-2xl text-gray-700" />
                  <span className="font-medium  text-left">
                    {dateRange[0].startDate && dateRange[0].endDate
                      ? `${format(
                          dateRange[0].startDate,
                          'dd/MM/yyyy'
                        )} - ${format(dateRange[0].endDate, 'dd/MM/yyyy')}`
                      : 'Fecha entrada - Fecha fin'}
                  </span>
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showCalendar && (
                  <div className="absolute z-20 bg-white p-2 shadow-lg rounded-lg mt-2 left-1/2 transform -translate-x-1/2">
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setDateRange([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={dateRange}
                      months={calendarConfig.months}
                      direction={calendarConfig.direction}
                      className="w-full sm:w-auto"
                    />
                  </div>
                )}
              </div>

              {/* Botón Buscar */}
              <div className="flex items-center justify-center">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-teal-600 hover:bg-teal-600/70 text-white rounded-md px-6 md:px-8 md:py-3 shadow-lg transition-colors min-h-[48px] md:text-lg font-semibold"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
