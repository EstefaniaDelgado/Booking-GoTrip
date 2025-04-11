import { Link } from 'react-router';
import ProductsTable from './components/ProductsTable';
import { LuTable2 } from 'react-icons/lu';
import { Button } from '@material-tailwind/react';

const ListProducts = () => {
  return (
    <section className="w-full max-w-[898px] mx-auto pt-4">
      <div className="flex flex-row-reverse justify-self-start gap-2">
        <h2 className="text-4xl font-semibold tracking-wide">
          Tabla de Eventos Creados
        </h2>
        <LuTable2 size={40} />
      </div>

      <p className="text-platinum my-5">
        Mira más información sobre el evento.
      </p>
      <Link to={'/administracion/crear-producto'} className='block pb-5'>
        <button className="bg-sky hover:bg-sky/80 py-2 px-4 rounded-lg text-white capitalize font-light tracking-wider">
          Agregar Producto
        </button>
      </Link>
      <ProductsTable />
    </section>
  );
};

export default ListProducts;
