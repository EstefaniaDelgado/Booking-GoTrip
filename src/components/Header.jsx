import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { useContext } from 'react';
import { EventContext } from '../context/ProductContext';
import { IoSearch } from 'react-icons/io5';
import { FaRegCalendarAlt } from "react-icons/fa";
import Plane from '../assets/plane.png';

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
    fetch(`${apiUrl}/categorias`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error('Error obteniendo categorías:', error));
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
    <section
      className="min-h-screen bg-hero bg-no-repeat bg-cover md:py-5 bg-center"
    >
    <div className='relative z-30 mx-auto md:h-screen md:flex max-w-screen-2xl'>
    <img src={Plane} alt="plane" className='absolute left-1/2 transform -translate-x-1/2 h-[400px] -z-10 md:right-0 md:transform-none md:h-[530px] xl:h-[600px]' />
      <div className="py-8 md:px-10 lg:px-20 flex flex-col items-center justify-center md:items-start gap-4 md:p-4">
          {/* Caja del título */}
          <div className="space-y-2 tracking-wide px-6 md:px-0 text-black w-full ">
            <h1 className="text-4xl text-center capitalize font-semibold md:text-left md:text-6xl xl:text-8xl md:w-11/12 ">
              Descubre tu próxima aventura
            </h1>
            <h2 className="text-lg text-center md:text-xl  font-normal md:text-left">
              Encuentra las mejores ofertas en tours, excursiones y más...
            </h2>
          </div>

          {/* Contenedor con buscador, calendario y categorías */}
          <div className="flex flex-col gap-3">
            {/* Buscador */}
            <div className="bg-white md:w-full mx-auto md:mx-auto text-black/70 rounded-lg shadow-lg flex items-center p-2 px-3 min-h-[48px] hover:border-gray-400 hover:border-2">
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

           <div className='w-full px-2 md:px-0 flex text-sm gap-3 '>
             {/* Calendario */}
             <div ref={calendarRef}>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full h-full bg-white text-gray-400 rounded-lg px-4 py-2 shadow-lg flex items-center  gap-3 transition-colors font-light "
              >
               <FaRegCalendarAlt className="text-2xl text-gray-700"/>
                <span className="font-medium  text-left">
                  {dateRange[0].startDate && dateRange[0].endDate
                    ? `${format(
                        dateRange[0].startDate,
                        "dd/MM/yyyy"
                      )} - ${format(dateRange[0].endDate, "dd/MM/yyyy")}`
                    : "Fecha entrada - Fecha fin"}
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
                className="w-full md:w-auto bg-sky text-black rounded-3xl px-6 md:px-8 md:py-3 shadow-lg transition-colors min-h-[48px] md:text-lg font-semibold"
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
