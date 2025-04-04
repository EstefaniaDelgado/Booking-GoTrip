import { Typography } from '@material-tailwind/react';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router';
import DataBooking from './components/DataBooking/DataBooking';
import SuccessBooking from './components/SuccessBooking';
import GlobalWhatsAppContactButton from '../Home/components/GlobalWhatsAppContactButton';


const Booking = () => {
 
  
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const productData = JSON.parse( localStorage.getItem("Event")) || {};

  const handleGoBackIcon=()=>{
    navigate(-1)
  }

  return (
    <section className="flex-1 flex flex-col">
      <article className="bg-sky text-white font-medium text-2xl p-6 mt-10 ">
        <div className="mx-auto flex justify-between max-w-screen-2xl">
          <h2 className="lg:text-3xl"> Reservación</h2>
          <IoArrowBackCircleOutline
            size={30}
            className="cursor-pointer"
            onClick={handleGoBackIcon}
          />
        </div>
      </article>

      <article className="mx-auto w-full  max-w-screen-2xl">
        <Typography className="font-semibold text-center text-xl lg:text-3xl text-[#3C6E71] mt-3 md:mt-8">
          Proceso de Reserva de {productData.name}
        </Typography>
        <div className=" flex justify-evenly md:justify-center md:gap-10 items-center py-5 lg:py-8">
          <div className="flex flex-col items-center gap-2">
            <span
              className={`${
                pathname === '/reservar-informacion'
                  ? 'bg-sky'
                  : 'bg-white border border-gray-400'
              } inline-block px-2 lg:px-6 lg:py-3 lg:text-3xl rounded-full text-dark-slate-gray`}
            >
              1
            </span>
            <p className="self-end text-[#3C6E71] lg:text-2xl">Información</p>
          </div>
          <div className="w-[60px] md:w-[100px] lg:w-[150px] h-1 bg-gray-400 mx-4 md:mx-6 "></div>
          <div className="flex flex-col items-center gap-2">
            <span
              className={`${
                pathname === '/reservar-informacion/confirmacion'
                  ? 'bg-sky'
                  : 'bg-white border border-gray-400'
              } inline-block px-2 lg:px-6 lg:py-3 lg:text-3xl rounded-full text-dark-slate-gray`}
            >
              2
            </span>
            <p className="self-end text-[#3C6E71] lg:text-2xl">Confirmación</p>
          </div>
        </div>
      </article>

      <article>
        {pathname === '/reservar-informacion' ? (
          <DataBooking  />
        ) : (
          <SuccessBooking />
        )}
      </article>
      <GlobalWhatsAppContactButton 
        message="Tengo preguntas sobre el proceso de reserva. ¿Pueden ayudarme?"
      />
    </section>
  );
};

export default Booking;
