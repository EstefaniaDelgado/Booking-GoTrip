import { Typography } from '@material-tailwind/react';
import BookingForm from './components/BookingForm';

const DataBooking = () => {
  return (
    <section className="p-6 w-full mx-auto max-w-screen-2xl">
      <Typography className="font-bold capitalize tracking-wide text-xl lg:text-3xl text-[#3C6E71] mt-3 md:mt-5">
       Por favor, proporcionanos tus datos 
      </Typography>
      <h3 className="font-semibold text-dark-slate-gray text-xl">
        Haz tu reserva Hoy!
      </h3>
      <article className="my-5">
        <BookingForm />
      </article>
    </section>
  );
};

export default DataBooking;
