import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { USER_BOOKING } from "../../../utils/constantsLocalSorage";
import { useNavigate } from "react-router";
import { createReservation } from "../../../services/reserveService";

const SuccessBooking = () => {
  const [bookingData, setBookingData] = useState({});
  const [userData, setUserData] = useState({});
  const [eventData, setEventData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const userBooking = JSON.parse(localStorage.getItem("User_Booking")) || {};
    const userGoTrip = JSON.parse(localStorage.getItem("userGoTrip")) || {};
    const event = JSON.parse(localStorage.getItem("Event")) || {};
    const jwt = userGoTrip.token; // Extraer el token correctamente

    setBookingData(userBooking);
    setUserData(userGoTrip.user); // Extraer los datos del usuario
    setEventData(event);
  }, []);

  const handleSubmitDataReservation = async () => {
    const jwt = localStorage.getItem("userGoTrip")
      ? JSON.parse(localStorage.getItem("userGoTrip")).token
      : null;

    if (!jwt || !userData || !bookingData || !eventData) {
      alert("Faltan datos para confirmar la reserva");
      return;
    }

    const reservationData = {
      name: userData.nombre,
      lastname: userData.apellido,
      email: userData.correoElectronico,
      message: bookingData.message || "",
      startDate: bookingData.startDate?.split("T")[0],
      endDate: bookingData.endDate?.split("T")[0],
      userId: userData.id,
      productId: eventData.id,
    };

    try {
      const result = await createReservation(reservationData, jwt);
      // console.log("✅ Reserva confirmada:", result);

      setTimeout(() => {
        navigate("/reserva-confirmada", {
          state: { reservation: result, event: eventData },
        });
      }, 2000);
    } catch (err) {
      console.error("❌ Error al registrar reserva:", err);
      alert("Error al registrar la reserva");
    }
  };

  return (
    <div className="p-3 w-full mx-auto max-w-screen-2xl">
      <Typography className="font-bold capitalize tracking-wide text-xl lg:text-2xl text-[#3C6E71] mt-3 md:mt-5">
        Tu lugar está reservado, solo falta tu confirmación
      </Typography>

      {/* INFORMACIÓN DEL USUARIO */}
      <Card className="border-2 mt-5">
        <Typography className="font-bold text-center md:text-start md:px-5 mt-5 tracking-wide text-xl text-gray-600 border-b pb-2">
          Información de la Reserva
        </Typography>
        <CardBody className="flex flex-col md:flex-row md:justify-around gap-3">
          <div>
            <h3 className="font-semibold text-gray-600">Nombre</h3>
            <p className="font-medium text-gray-900">{bookingData?.name}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600">Apellido</h3>
            <p className="font-medium text-gray-900">{bookingData?.lastname}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600">Correo Electrónico</h3>
            <p className="font-medium text-gray-900">{bookingData?.email}</p>
          </div>
        </CardBody>
      </Card>

      {/* DETALLE DEL PRODUCTO */}
      <div className="p-6 border-2 border-[#3C6E71] rounded-lg shadow-md max-w-4xl w-full mt-6 mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">
            {eventData.images && eventData.images.length > 0 ? (
              <img
                src={eventData.images[0]}
                alt={eventData.name}
                className="rounded-lg w-full h-auto mb-4"
              />
            ) : (
              <p className="text-gray-500">No hay imagen disponible</p>
            )}
          </div>
          <div className="flex-1 lg:pl-6">
            <h3 className="text-xl font-bold mb-2">{eventData.name}</h3>
            <p className="text-sm text-gray-700">{eventData.description}</p>
            <div className="mt-4">
              <p>
                <strong>Desde:</strong> {bookingData.startDate?.split("T")[0]}
              </p>
              <p>
                <strong>Hasta:</strong> {bookingData.endDate?.split("T")[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex flex-row-reverse items-center">
        <Button
          className="flex font-medium justify-center items-center gap-3 mx-auto my-6 bg-sky capitalize lg:text-2xl"
          onClick={handleSubmitDataReservation}
        >
          Confirmar
        </Button>
        <Button
          className="flex font-medium justify-center items-center gap-3 mx-auto my-6 bg-sky capitalize lg:text-2xl"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </div>
    </div>
  );
};

export default SuccessBooking;
