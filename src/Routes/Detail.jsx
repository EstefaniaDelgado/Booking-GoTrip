import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useContext } from "react";
import Gallery from "../components/Gallery";
import axios from "axios";
import { EventContext } from "../context/ProductContext";
import HeartFavorite from "../views/Home/components/HeartFavorite";
import { getFavoritesProducts } from "../services/favoritesServie";
import ShareProduct from "../views/ShareProduct";
import { MdShare } from "react-icons/md";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { DateRangeContext } from "../context/DateRangeContext";
import { EVENT } from "../utils/constantsLocalSorage";
import WhatsAppContactButton from "../views/Home/components/WhatsAppContactButton";
import { getReviews } from "../services/reviewService";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //const { events } = useContext(EventContext);
  const [currentEvent, setCurrentEvent] = useState({
    id: null,
    name: "",
    description: "",
    price: null,
    images: [],
    categoryOutputDTO: null,
    features: [],
    fechaInicio: new Date(),
    fechaFin: new Date(),
  });
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  // const [dateRange, setDateRange] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: 'selection',
  //   },
  // ]);
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  // console.log("fechas detalle", dateRange);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  /* Funcionalidad de Reseñas */
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getReviews(id);

        // Asegúrate de que reviewsData sea un array de reseñas
        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData); // Directamente toma el array de reseñas

          if (reviewsData.length > 0) {
            const totalRating = reviewsData.reduce(
              (sum, review) => sum + review.rating,
              0
            );
            setAverageRating((totalRating / reviewsData.length).toFixed(1)); // Promedio con 1 decimal
          } else {
            setAverageRating(0); // Si no hay reseñas, promedio = 0
          }
        } else {
          console.error(
            "Se esperaba un array de reseñas, pero se recibió:",
            reviewsData
          );
          setReviews([]); // Si no se recibe un array válido, establecemos 'reviews' como array vacío
          setAverageRating(0); // Si hay un error, el promedio será 0
        }
      } catch (error) {
        console.error("Error al obtener las reseñas:", error);

        // Si ocurre un error, no usamos datos de respaldo
        setReviews([]); // No mostramos reseñas
        setAverageRating(0); // Promedio a 0 en caso de error
      }
    };

    fetchReviews();
  }, [id]);

  /* Funcionalidad de Favoritos */
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("userGoTrip")) || {};
  const idUser = storedUser?.user?.id;

  const apiUrl =
    import.meta.env.VITE_API_URL_DEVELOPMENT ||
    import.meta.env.VITE_API_URL_PRODUCTION;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/productos/${id}`);
        const eventData = response.data;
        // console.log('Datos del evento:', eventData); // Verifica los datos recibidos
        //setCurrentEvent(eventData);
        // Convertir fechas a objetos Date
        const startDate = new Date(eventData.fechaInicio + "T00:00:00");
        const endDate = new Date(eventData.fechaFin + "T23:59:59");

        // Validar fechas
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Fechas no válidas");
        }

        // Actualizar el estado del evento
        setCurrentEvent({
          ...eventData,
          fechaInicio: startDate,
          fechaFin: endDate,
        });

        // Actualizar el estado del rango de fechas
        setDateRange([
          {
            startDate: startDate,
            endDate: endDate,
            key: "selection",
          },
        ]);

        // // Obtener características
        // const featuresResponse = await axios.get(`${apiUrl}/features`);
        // const featuresData = featuresResponse.data;
        // if (Array.isArray(featuresData)) {
        //   setFeatures(featuresData);
        // } else if (featuresData && Array.isArray(featuresData.content)) {
        //   setFeatures(featuresData.content);
        // } else {
        //   console.error("Formato de respuesta inesperado:", featuresData);
        //   setFeatures([]);
        // }
      } catch (error) {
        console.error("Error al obtener los detalles del evento:", error);
        setError("No se pudieron cargar los detalles del evento");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, setDateRange]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const data = await getFavoritesProducts(idUser);
        setFavorites(data);
      } catch (error) {
        console.log("Error al traer favoritos:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };
    if (idUser) {
      fetchApi();
    }
  }, [idUser]);

  const goBack = () => {
    navigate(-1);
  };

  const handleDateClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (item) => {
    const { startDate, endDate } = item.selection;

    // Verificar que las fechas estén dentro del rango permitido
    const eventStartDate = new Date(currentEvent.fechaInicio);
    const eventEndDate = new Date(currentEvent.fechaFin);

    if (startDate < eventStartDate || endDate > eventEndDate) {
      alert("Las fechas seleccionadas están fuera del rango permitido.");
      return;
    }

    // Actualizar el estado del rango de fechas
    setDateRange([item.selection]);

    // Cerrar el calendario si se seleccionan dos fechas diferentes
    if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
      setShowCalendar(false);
    }
  };

  const getMainCalendarConfig = () => {
    if (windowWidth < 768) {
      return {
        months: 1,
        direction: "vertical",
        className: "border border-gray-300 rounded-lg shadow-md w-full",
      };
    } else {
      return {
        months: 2,
        direction: "horizontal",
        className: "border border-gray-300 rounded-lg shadow-md",
      };
    }
  };

  // Determinar configuración del calendario emergente según el ancho de la pantalla
  const getPopupCalendarConfig = () => {
    if (windowWidth < 768) {
      return {
        months: 1,
        direction: "vertical",
        className: "border border-gray-300 rounded-lg shadow-md w-full",
      };
    } else if (windowWidth < 1024) {
      return {
        months: 1,
        direction: "vertical",
        className: "border border-gray-300 rounded-lg shadow-md w-full",
      };
    } else {
      return {
        months: 2,
        direction: "horizontal",
        className: "border border-gray-300 rounded-lg shadow-md",
      };
    }
  };

  const mainCalendarConfig = getMainCalendarConfig();
  const popupCalendarConfig = getPopupCalendarConfig();

  if (!currentEvent) {
    return (
      <div className="w-full mt-[40px] p-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg text-gray-700 mb-4">Cargando evento...</p>
        </div>
      </div>
    );
  }

  const productForShare = {
    id: currentEvent.id,
    name: currentEvent.name,
    description: currentEvent.description,
    imageUrl:
      currentEvent.images && currentEvent.images.length > 0
        ? currentEvent.images[0]
        : "",
  };

  return (
    <>
      <div className="w-full mt-[40px] bg-gray-200">
        {/* Header */}
        <div className="relative w-full bg-[#35A6B8] p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">
              {currentEvent.name}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="flex items-center h-8 w-8">
                <HeartFavorite
                  event={currentEvent}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center text-white hover:text-gray-200"
              >
                <MdShare size={32} />
              </button>
              {/*<img
              src="/arrow-circle-left-svgrepo-com.svg"
              alt="Volver"
              className="w-8 h-8 cursor-pointer"
              onClick={goBack}
            />*/}
              <button
                onClick={goBack}
                className="flex items-center text-white hover:text-gray-200"
              >
                <IoArrowBackCircleOutline size={32} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            <Gallery images={currentEvent.images} />

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Descripción</h3>
              <p className="text-gray-700">{currentEvent.description}</p>
            </div>

            {/* Contenedor principal para características y calendario */}
            <div className="mt-8 flex flex-col lg:flex-row gap-8">
              {/* Bloque de Características */}
              <div className="lg:w-2/3">
                <h3 className="text-xl font-semibold mb-4">Características</h3>
                {loading ? (
                  <p className="text-gray-500">Cargando características...</p>
                ) : error ? (
                  <div className="bg-red-50 p-4 border border-red-200 rounded">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : currentEvent.features &&
                  currentEvent.features.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {currentEvent.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="bg-gray-50 p-4 rounded flex flex-col items-center justify-center text-center border border-gray-200"
                      >
                        <div className="w-12 h-12 flex items-center justify-center mb-2">
                          {feature.description &&
                          feature.description.startsWith("http") ? (
                            <img
                              src={feature.description}
                              alt={feature.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <img
                              src="/default-icon.svg"
                              alt={feature.name}
                              className="w-6 h-6"
                            />
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No hay características disponibles
                  </p>
                )}

                {/* Reseñas */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Reseñas</h3>
                  <Link to={`/reseñas/${id}`}>
                    <div className="bg-white p-4 rounded-lg border shadow-md cursor-pointer">
                      <div className="flex flex-col md:flex-row justify-between items-center p-4">
                        <p className="text-lg font-bold text-center text-[#3C6E71] p-4">
                          Esta calificación es el resultado de la opinión de
                          nuestra comunidad.
                        </p>
                        <div className="flex flex-col items-center bg-[#3C6E71] text-white rounded-2xl px-8 py-4 shadow-lg mt-4 md:mt-0">
                          <FaStar className="text-yellow-400 text-3xl" />
                          <p className="text-2xl font-bold mt-2">
                            {averageRating ? averageRating : "0.0"}
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border-t border-gray-300" />
                      <p className="text-lg font-semibold text-gray-600 text-right pr-4">
                        ({reviews && reviews.length > 0 ? reviews.length : 0}{" "}
                        reseñas)
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Calendario doble debajo de características */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Selecciona tus fechas
                  </h3>
                  <div className="w-full overflow-x-auto">
                    <DateRange
                      rangeColors={["#35A6B8"]}
                      editableDateInputs={true}
                      onChange={handleDateChange}
                      moveRangeOnFirstSelection={false}
                      ranges={dateRange}
                      months={mainCalendarConfig.months}
                      direction={mainCalendarConfig.direction}
                      minDate={new Date(currentEvent.fechaInicio)}
                      maxDate={new Date(currentEvent.fechaFin)}
                      className={mainCalendarConfig.className}
                    />
                  </div>
                </div>
              </div>

              {/* Disponibilidad de Reserva */}
              <div className="lg:w-1/3">
                <div className="bg-white shadow-md rounded-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-4">
                    Disponibilidad de Reserva
                  </h3>
                  <div className="flex justify-between items-center mb-4 gap-2">
                    <div
                      className="w-full sm:flex-1 flex flex-col border p-3 sm:p-4 rounded-lg cursor-pointer mb-2 sm:mb-0"
                      onClick={handleDateClick}
                    >
                      <span className="text-sm text-gray-500">Entrada</span>
                      <span className="text-lg font-medium truncante">
                        {/* {dateRange[0].startDate.toLocaleDateString()} */}
                        {dateRange[0]?.startDate
                          ? new Date(
                              dateRange[0].startDate
                            ).toLocaleDateString()
                          : "Fecha no válida"}
                      </span>
                    </div>
                    <div
                      className="w-full sm:flex-1 flex flex-col border p-3 sm:p-4 rounded-lg cursor-pointer"
                      onClick={handleDateClick}
                    >
                      <span className="text-sm text-gray-500">Salida</span>
                      <span className="text-lg font-medium truncante">
                        {/* {dateRange[0].endDate.toLocaleDateString()} */}
                        {dateRange[0]?.endDate
                          ? new Date(dateRange[0].endDate).toLocaleDateString()
                          : "Fecha no válida"}
                      </span>
                    </div>
                  </div>

                  {showCalendar && (
                    <div className="mb-4">
                      <div className="w-full overflow-auto">
                        <DateRange
                          rangeColors={["#35A6B8"]}
                          editableDateInputs={true}
                          onChange={handleDateChange}
                          moveRangeOnFirstSelection={false}
                          ranges={dateRange}
                          months={popupCalendarConfig.months}
                          direction={popupCalendarConfig.direction}
                          minDate={new Date(currentEvent.fechaInicio)}
                          maxDate={new Date(currentEvent.fechaFin)}
                          className={popupCalendarConfig.className}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-medium text-[#35A6B8]">
                      ${currentEvent.price}
                    </span>
                  </div>

                  <Link to={"/reservar-informacion"}>
                    <button
                      className="w-full bg-[#35A6B8] text-white py-3 rounded-lg hover:bg-[#2d8b9a] transition-colors"
                      onClick={() =>
                        localStorage.setItem(
                          EVENT,
                          JSON.stringify(currentEvent)
                        )
                      }
                    >
                      Reservar
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppContactButton event={currentEvent} />
      {/* Modal de compartir */}
      {showShareModal && (
        <ShareProduct
          productId={productForShare.id}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};

export default Detail;
