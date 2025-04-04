import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GlobalWhatsAppContactButton from "../Home/components/GlobalWhatsAppContactButton";
import { USER_BOOKING } from "../../utils/constantsLocalSorage";

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event || {};
  const [bookingData, setBookingData] = useState({});

  useEffect(() => {
    const userBooking = JSON.parse(localStorage.getItem(USER_BOOKING)) || {};
    // console.log("Datos de la reserva:", userBooking);
    setBookingData(userBooking);
  }, []);

  if (!event.name) {
    return (
      <p className="text-center mt-10 text-red-500">
        No se encontraron detalles de la reserva.
      </p>
    );
  }

  return (
    <section className="flex-1 flex flex-col">
      {/* Encabezado */}
      <article className="bg-sky text-white font-medium text-2xl p-6 mt-10">
        <div className="mx-auto flex justify-between items-center max-w-screen-2xl">
          <h2 className="lg:text-3xl">Reserva realizada con éxito</h2>
        </div>
      </article>

      {/* Información del evento y Detalles de la reserva fusionados en una sola tarjeta */}
      <div className="mx-auto max-w-screen-md mt-8 mb-6">
        {/* Tarjeta fusionada con la información del evento y los detalles de la reserva */}
        <div className="p-6 border-2 border-[#3C6E71] rounded-lg shadow-md">
          <div className="flex flex-col lg:flex-row items-center mb-6">
            {/* Información del evento */}
            {event.images && (
              <img
                src={event.images[0]}
                alt={event.name}
                className="w-32 h-32 rounded-lg object-cover mb-4 lg:mb-0 lg:mr-6"
              />
            )}
            <div>
              <p className="text-2xl font-bold text-[#3C6E71]">{event.name}</p>
              <p className="text-gray-600 text-sm mt-1">{event.description}</p>
            </div>
          </div>

          {/* Línea divisora debajo de la información del producto */}
          <hr className="border-[#3C6E71] my-6" />

          {/* Detalles de la reserva */}
          <div className="flex flex-col lg:flex-row justify-between">
            {/* Detalles del comprador */}
            <div className="w-full lg:w-1/2 pr-0 lg:pr-4 mb-6 lg:mb-0">
              <h3 className="text-lg font-semibold text-[#3C6E71]">
                Detalles del comprador
              </h3>
              <p className="text-lg text-gray-700">
                Nombre: {bookingData?.name || "No disponible"}
              </p>
              <p className="text-lg text-gray-700">
                Apellido: {bookingData?.lastname || "No disponible"}
              </p>
              <p className="text-lg text-gray-700">
                Correo: {bookingData?.email || "No disponible"}
              </p>
            </div>

            {/* Línea divisora vertical en pantallas grandes */}
            <div className="border-l-2 border-[#3C6E71] mx-4 hidden lg:block"></div>

            {/* Datos de la reserva */}
            <div className="w-full lg:w-1/2 pl-0 lg:pl-4">
              <h3 className="text-lg font-semibold text-[#3C6E71]">
                Datos de la reserva
              </h3>
              <p className="text-lg text-gray-700">
                Día de inicio:{" "}
                {bookingData?.startDate
                  ? new Date(bookingData?.startDate).toLocaleDateString()
                  : "No definido"}{" "}
              </p>
              <p className="text-lg text-gray-700">
                Día de fin:{" "}
                {bookingData?.endDate
                  ? new Date(bookingData?.endDate).toLocaleDateString()
                  : "No definido"}
              </p>
              <p className="text-lg text-gray-700">
                Costo total: ${event.price || "No disponible"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de ir al inicio */}
      <div className="flex justify-center mt-2 mb-6">
        <button
          className="text-base bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 font-semibold transition-colors duration-200 shadow-md"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>
      </div>

      {/* Botón de WhatsApp */}
      <GlobalWhatsAppContactButton message="Tengo algunas preguntas sobre la información de la reserva. ¿Pueden ayudarme?" />
    </section>
  );
};

export default ConfirmBooking;
