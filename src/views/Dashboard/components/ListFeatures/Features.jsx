import FeaturesTable from './components/FeaturesTable';
import { Link } from 'react-router-dom';
import { LuTable2 } from 'react-icons/lu';

const Features = () => {
  return (
    <section className='w-full max-w-[898px] mx-auto pt-4'>
      <div className="flex flex-row-reverse justify-self-start gap-2">
              <h2 className="text-4xl font-semibold tracking-wide">Tabla de Características</h2>
              <LuTable2 size={40} />
            </div>
      <p className="text-platinum my-5">Mira mas información sobre las Características de los eventos.</p>
      <button
        className="bg-sky text-white font-light py-2 px-4 rounded-lg hover:bg-sky/80 transition-all mb-6"
      >
        <Link to="/administracion/agregar-caracteristica">Agregar Característica</Link>
      </button>
      <FeaturesTable />
    </section>
  );
};

export default Features;
