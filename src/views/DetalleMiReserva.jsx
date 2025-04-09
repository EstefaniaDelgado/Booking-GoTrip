import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

const DetalleMiReserva = () => {
  const { state } = useLocation();
  const { reservation, event } = state || {};
  const navigate = useNavigate();

  if (!reservation || !event) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center p-4">
        <h2 className="text-xl font-bold text-red-500">No hay información de la reserva</h2>
        <Button className="mt-4 bg-sky" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-[#3C6E71] text-center">¡Reserva Confirmada!</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Datos de la Reserva</h3>
          <p><strong>Nombre:</strong> {reservation.name}</p>
          <p><strong>Apellido:</strong> {reservation.lastname}</p>
          <p><strong>Email:</strong> {reservation.email}</p>
          <p><strong>Desde:</strong> {reservation.startDate}</p>
          <p><strong>Hasta:</strong> {reservation.endDate}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Detalles del Evento</h3>
          <p><strong>Evento:</strong> {event.name}</p>
          <img
            src={(event.images && event.images[0]) || "/placeholder.jpg"}
            alt={event.name}
            className="mt-2 rounded-lg w-full h-40 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.jpg";
            }}
          />
          <p className="mt-2 text-sm text-gray-600">{event.description}</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <Button className="bg-sky text-white" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default DetalleMiReserva;