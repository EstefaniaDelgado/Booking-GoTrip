import fotoFondo from "../assets/imagenBG.jpg";
import iconSearch from "../assets/search.svg";
import iconCalendar from "../assets/calendar.svg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { useContext } from "react";
import { EventContext } from "../context/ProductContext";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [destination, setDestination] = useState("");
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
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  useEffect(() => {
    fetch(`${apiUrl}/categorias`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error obteniendo categorías:", error));
  }, []);

  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const [calendarConfig, setCalendarConfig] = useState({
    months: 2,
    direction: "horizontal",
  });

  useEffect(() => {
    const updateCalendarConfig = () => {
      if (window.innerWidth < 1024) {
        setCalendarConfig({ months: 2, direction: "vertical" });
      } else {
        setCalendarConfig({ months: 2, direction: "horizontal" });
      }
    };

    updateCalendarConfig();
    window.addEventListener("resize", updateCalendarConfig);

    return () => window.removeEventListener("resize", updateCalendarConfig);
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
        "yyyy-MM-dd"
      )}&endDate=${format(dateRange[0].endDate, "yyyy-MM-dd")}`;
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section
      // className="relative min-h-[400px] md:h-[400px] w-full bg-cover bg-center"
       className="relative min-h-[400px] md:h-[400px] lg:h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${fotoFondo})`,
        backgroundPosition: "50% 65%",
      }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative h-full w-4/5 mx-auto px-4">
        <div className="h-full flex flex-col items-center justify-center space-y-8 p-2 md:p-4">
          {/* Caja del título */}
          <div className="bg-white rounded-lg px-6 py-4 shadow-lg mt-8 md:mt-0 w-full max-w-4xl">
            <h1 className="text-xl md:text-2xl text-[#3C6E71] font-medium text-left cursor-default">
              Descubre tu próxima aventura
            </h1>
            <h2 className="text-lg md:text-xl text-[#3C6E71] font-medium text-left cursor-default">
              Encuentra las mejores ofertas en tours, excursiones y más...
            </h2>
          </div>

          {/* Contenedor con buscador, calendario y categorías */}
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1 bg-[#3C6E71] text-white rounded-lg shadow-lg flex items-center p-2 px-3 min-h-[48px] hover:bg-[#2C4F53]">
              <img
                src={iconSearch}
                alt="Icono de búsqueda"
                className="mr-2 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Nombre del evento..."
                value={destination}
                onChange={handleSearchChange}
                className="flex-1 px-2 py-2 bg-transparent focus:outline-none text-white"
                ref={inputRef}
              />
            </div>

            {/* Sugerencias del campo de búsqueda */}
            {destination && suggestions.length > 0 && (
              <div
                className="absolute bg-[#3C6E71] border border-[#3C6E71] rounded-lg w-full max-w-md mt-[60px] shadow-lg z-10 bg-white text-gray-900"
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

            {/* Calendario */}
            <div className="relative flex-1" ref={calendarRef}>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full h-full bg-[#3C6E71] text-white rounded-lg px-6 py-3 shadow-lg flex items-center justify-between hover:bg-[#2C4F53] transition-colors min-h-[48px] text-sm md:text-base"
              >
                <img
                  src={iconCalendar}
                  alt="Icono de calendario"
                  className="mr-2 w-5 h-5"
                />
                <span className="font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px] text-left">
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
            <div className="flex items-center justify-center min-h-[48px]">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto bg-[#FF6D1B] text-white rounded-lg px-8 py-3 shadow-lg hover:bg-[#BF360C] transition-colors min-h-[48px] text-lg"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
