import { Card, Typography, Button } from '@material-tailwind/react';
import { useContext, useEffect, useState } from 'react';
import { validationBookingForm } from '../../../../../utils/validationBookingForm';
import { TbAlertCircle } from 'react-icons/tb';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { FaArrowRight } from 'react-icons/fa';
import { DateRangeContext } from '../../../../../context/DateRangeContext';
import { USER_BOOKING } from '../../../../../utils/constantsLocalSorage';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const BookingForm = () => {
  const [inputs, setInputs] = useState({ name: '', lastname: '', email: '', message: '' });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userBooking = JSON.parse(localStorage.getItem(USER_BOOKING)) || {};
    if (Object.keys(userBooking).length > 0) {
      setInputs((prev) => ({ ...prev, ...userBooking }));
    }
    const storedEvent = JSON.parse(localStorage.getItem('Event'));
    if (storedEvent) setEvent(storedEvent);
  }, []);

  const handleChangeInputs = (e) => {
    const { name, value } = e.target;
    const updatedInputs = { ...inputs, [name]: value };
    setInputs(updatedInputs);
    localStorage.setItem(USER_BOOKING, JSON.stringify(updatedInputs));
    const onChangeErrors = validationBookingForm(updatedInputs);
    const cleanedErrors = { ...error };
    if (!onChangeErrors[name]) delete cleanedErrors[name];
    setError({ ...cleanedErrors, ...onChangeErrors });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validationBookingForm(inputs);
    if (Object.keys(errors).length > 0) return setError(errors);
    try {
      const dataBooking = {
        ...inputs,
        startDate: dateRange[0].startDate || null,
        endDate: dateRange[0].endDate || null,
      };
      localStorage.setItem(USER_BOOKING, JSON.stringify(dataBooking));
      setIsLoading(true);
      setTimeout(() => navigate('confirmacion'), 1000);
    } catch (err) {
      console.error('Error haciendo la reserva:', err);
      toast('Hubo un problema, intenta de nuevo', { type: 'error' });
    }
  };

  const handleDateClick = () => setShowCalendar(!showCalendar);
  const handleDateChange = (item) => {
    const { startDate, endDate } = item.selection;
    const min = new Date(event?.fechaInicio);
    const max = new Date(event?.fechaFin);
    if (startDate < min || endDate > max) {
      alert('Las fechas están fuera del rango permitido');
      return;
    }
    setDateRange([item.selection]);
    if (startDate.getTime() !== endDate.getTime()) setShowCalendar(false);
  };

  const calculateNights = () => {
    const start = new Date(dateRange[0]?.startDate);
    const end = new Date(dateRange[0]?.endDate);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24) -1);
    return diff > 0 ? diff : 0;
  };

  return (
    <div>
      <Card className="border-2">
        <form onSubmit={handleSubmit} className="p-3 flex flex-col gap-3">
          <div className="py-3 flex flex-col gap-2 md:flex-row md:gap-8 md:items-start">
            <div className="flex-1">
              {/* INPUTS */}
              <div className="space-y-2 lg:flex md:gap-4">
                <div className="lg:w-1/2">
                  <Typography variant="h6" className="text-dark-slate-gray xl:text-xl lg:mb-2">Nombre*</Typography>
                  <input name="name" value={inputs.name} onChange={handleChangeInputs} placeholder="Yanina" className="w-full border-2 rounded-lg py-2 px-4 bg-blue-gray-100/20" />
                  {error.name && <p className="text-red-400 flex items-center gap-2"><TbAlertCircle />{error.name}</p>}
                </div>
                <div className="lg:w-1/2">
                  <Typography variant="h6" className="text-dark-slate-gray xl:text-xl lg:mb-2">Apellido*</Typography>
                  <input name="lastname" value={inputs.lastname} onChange={handleChangeInputs} placeholder="Olivera" className="w-full border-2 rounded-lg py-2 px-4 bg-blue-gray-100/20" />
                  {error.lastname && <p className="text-red-400 flex items-center gap-2"><TbAlertCircle />{error.lastname}</p>}
                </div>
              </div>
              <div className="mt-3">
                <Typography variant="h6" className="text-dark-slate-gray xl:text-xl">Correo Electrónico*</Typography>
                <input name="email" value={inputs.email} onChange={handleChangeInputs} placeholder="yanina@gmail.com" className="w-full border-2 rounded-lg py-2 px-4 bg-blue-gray-100/20" />
                {error.email && <p className="text-red-400 flex items-center gap-2"><TbAlertCircle />{error.email}</p>}
              </div>
              <div>
                <Typography variant="h6" className="text-dark-slate-gray xl:text-xl mt-2">Mensaje</Typography>
                <textarea name="message" value={inputs.message} onChange={handleChangeInputs} placeholder="Ejemplo: Realiza alguna indicación especial..." className="w-full border-2 rounded-lg h-40 p-2 bg-blue-gray-100/20" />
              </div>
            </div>

            {/* CARD DE RESERVA */}
            <Card className="md:flex-[0.8] h-full bg-white border shadow-md p-6 rounded-lg flex flex-col justify-between">
              <div>
                <Typography className="text-lg font-semibold mb-2 text-[#3C6E71]">Disponibilidad de Reserva</Typography>
                <p className="text-sm text-gray-700 mb-1">
                  {calculateNights()} días en <span className="font-semibold">{event?.name || 'la ciudad seleccionada'}</span>
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {dateRange[0]?.startDate && dateRange[0]?.endDate ? (
                    <>
                      {new Date(dateRange[0].startDate).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })} - {new Date(dateRange[0].endDate).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                    </>
                  ) : 'Fechas no disponibles'}
                </p>
                <hr className="mb-4" />
                <div className="flex justify-between items-center mb-4 gap-2">
                  <div className="flex-1 border rounded-md p-3 cursor-pointer" onClick={handleDateClick}>
                    <p className="text-sm text-gray-500 mb-1">Entrada</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl"></span>
                      <span className="text-base font-medium">
                        {dateRange[0]?.startDate ? new Date(dateRange[0].startDate).toLocaleDateString() : 'Fecha no válida'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 border rounded-md p-3 cursor-pointer" onClick={handleDateClick}>
                    <p className="text-sm text-gray-500 mb-1">Salida</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl"></span>
                      <span className="text-base font-medium">
                        {dateRange[0]?.endDate ? new Date(dateRange[0].endDate).toLocaleDateString() : 'Fecha no válida'}
                      </span>
                    </div>
                  </div>
                </div>
                {showCalendar && (
                  <DateRange
                    rangeColors={["#3C6E71"]}
                    editableDateInputs={true}
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    months={window.innerWidth < 768 ? 1 : 2}
                    direction={window.innerWidth < 768 ? "vertical" : "horizontal"}
                    minDate={event?.fechaInicio ? new Date(event.fechaInicio) : new Date()}
                    maxDate={event?.fechaFin ? new Date(event.fechaFin) : null}
                    className="border border-gray-300 rounded-lg shadow-md"
                  />
                )}
                <hr className="my-4" />
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-[#3C6E71]">Total:</span>
                  <span className="text-base font-medium">${Math.round((event?.price || 0) * calculateNights())}</span>
                </div>
              </div>
              <Button
                className="w-full bg-[#3C6E71] text-white py-3 rounded-lg hover:bg-[#2b5d5d] transition-colors"
                type="submit"
                disabled={Object.keys(error).length > 0 || isLoading}
              >
                Confirmar Reserva
              </Button>
            </Card>
          </div>
        </form>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default BookingForm;