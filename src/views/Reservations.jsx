import { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {
  FaCalendarAlt,
  FaStar,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import GlobalWhatsAppContactButton from "./Home/components/GlobalWhatsAppContactButton";
import { getReservations } from "../services/reserveService";
import { getProductById } from "../services/productService";
import { submitReview } from "../services/reviewService";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0); // Calificación
  const [message, setMessage] = useState(""); // Mensaje de calificación
  const [userLogin, setUserLogin] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleOpenModal = (reservation) => {
    setSelectedReservation(reservation); // Guardamos la reserva seleccionada
    setShowRatingModal(true);
  };

  const handleCloseModal = () => {
    setShowRatingModal(false);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating); // Actualizar la calificación
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value); // Actualizar el mensaje
  };

  const storedUser = JSON.parse(localStorage.getItem("userGoTrip")) || {};
  const idUser = storedUser?.user?.id;

  // Lógica de la calificación
  const handleSubmit = async () => {
    // Datos necesarios para crear la reseña
    const newReview = {
      firstName: storedUser.user?.nombre,
      lastName: storedUser.user?.apellido,
      reserveId: selectedReservation?.id,
      rating: rating,
      comment: message || "",
    };

    try {
      await submitReview(newReview); // Llamada a la función que envía la reseña
      console.log("Reseña enviada:", newReview);
      setShowRatingModal(false); // Cierra el modal
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwt = localStorage.getItem("userGoTrip")
          ? JSON.parse(localStorage.getItem("userGoTrip")).token
          : null;
        if (!jwt) {
          console.log("Usuario no autenticado");
          setIsLoading(false);
          return;
        }

        // Obtener reservas
        const reservations = await getReservations(jwt);
        // console.log("Reservas recibidas:", reservations);

        if (reservations && Array.isArray(reservations)) {
          const productsPromises = reservations.map(async (reservation) => {
            try {
              // console.log(
              //   `Obteniendo producto para reserva ${reservation.id} con productId: ${reservation.productId}`
              // );

              const productResponse = await getProductById(
                reservation.productId
              );
              // console.log(
              //   `Detalles del producto para la reserva ${reservation.id}:`,
              //   productResponse
              // );

              return { ...reservation, event: productResponse || null };
            } catch (productError) {
              console.log(
                `Error al obtener el producto con ID ${reservation.productId}:`,
                productError
              );
              return { ...reservation, event: null };
            }
          });

          const reservationsWithProductDetails = await Promise.all(
            productsPromises
          );
          setReservations(reservationsWithProductDetails);
        } else {
          console.log(
            "La respuesta no es válida o no contiene reservas:",
            reservations
          );
        }
      } catch (error) {
        console.log("Error al obtener reservas", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idUser]);

  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  return (
    <section className="flex-1 flex flex-col bg-gray-200">
      <div className="relative w-full bg-[#35A6B8] p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Reservas</h2>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center text-white hover:text-gray-200"
              onClick={"/"}
            >
              <IoArrowBackCircleOutline size={32} />
            </button>
          </div>
        </div>
      </div>
      <div className="text-center py-5 font-semibold md:text-xl tracking-wider text-[#3C6E71]">
        <p className={`${reservations?.length ? "block" : "hidden"}`}>
          Tienes {reservations?.length} evento en tu lista de reservas.
        </p>
      </div>
      <article className="text-center mx-auto flex-1 flex flex-col justify-center pt-5 pb-10 px-4 xl:px-0 max-w-screen-2xl">
        {isLoading ? (
          <p>Cargando Reservas...</p>
        ) : !reservations?.length ? (
          <p>No tienes reservas aún</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 w-full">
            {sortedReservations.map((reservation) => (
              <div
                key={`reservation-${reservation.id}`}
                className="border rounded-lg p-5 shadow-lg bg-white w-full max-w-5xl mx-auto"
              >
                {/* Fecha de reserva */}
                <div className="text-lg font-semibold text-gray-700 flex items-center">
                  <FaCalendarAlt className="text-gray-600 mr-2" />
                  <span>
                    {reservation.startDate} - {reservation.endDate}
                  </span>
                </div>

                <hr className="border-gray-300 my-3" />

                {/* Contenedor principal */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start">
                  {/* Imagen del evento */}
                  <img
                    src={
                      reservation.event?.images[0] || "default-image-url.jpg"
                    }
                    alt={reservation.event?.name || "Evento sin nombre"}
                    className="w-40 h-40 rounded-lg object-cover"
                  />

                  {/* Información del evento */}
                  <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 text-left pr-10">
                    <p className="text-2xl font-bold text-[#3C6E71] mt-2">
                      {reservation.event?.name || "Evento sin nombre"}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 pr-6">
                      {reservation.event?.description ||
                        "Descripción no disponible"}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center items-center sm:ml-6 mt-4 sm:mt-0">
                    <button
                      onClick={() => handleOpenModal(reservation)} // Pasamos la reserva al abrir el modal
                      className="bg-[#3C6E71] text-white hover:bg-[#2c5f50] shadow-md px-4 py-2 rounded-lg w-40 flex justify-center items-center"
                    >
                      <FaStar className="mr-2 text-yellow-500" />
                      Calificar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
      {/* Modal de calificación */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold text-gray-900">
                Calificar evento
              </div>
              <button onClick={handleCloseModal}>X</button>
            </div>
            <hr className="my-2 border-gray-300" />
            <p className="font-bold text-[#3C6E71] mt-1 text-center">
              ¡Ayúdanos a mejorar!
            </p>
            <p className="font-bold text-[#3C6E71] mt-1 text-center">
              Califica este evento del 1 al 5
            </p>
            <div className="flex justify-center mt-3">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`cursor-pointer ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Escribe un mensaje para acompañar al evento que deseas calificar."
              className="w-full mt-4 p-2 border rounded-lg"
            />
            <button
              onClick={handleSubmit}
              className="w-full mt-4 py-2 bg-[#3C6E71] text-white font-semibold rounded-lg hover:bg-[#2c5f50]"
            >
              Calificar
            </button>
          </div>
        </div>
      )}
      <GlobalWhatsAppContactButton message="Tengo algunas preguntas sobre las reservas . ¿Pueden ayudarme?" />
    </section>
  );
};

export default Reservations;
