import { useState } from 'react';
import { Button } from '@material-tailwind/react';
import { createFeatures } from '../../../../../services/featuresService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconSelector from './IconSelector';

const AddFeature = () => {
  const [name, setName] = useState('');
 // const [description, setDescription] = useState('');

  const navigate = useNavigate();

  const handleSelectFeature = (feature) => {
    setName(feature);
  };

  const handleAddFeature = async (e) => {
    e.preventDefault();
    try {
      const newFeature = {
        name,
      };
      console.log('envio al servidor', newFeature);
      await createFeatures(newFeature);

      toast('Característica agregada con éxito!', {
        position: 'top-right',
        type: 'success',
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate('/administracion/caracteristicas');
      }, 1000);
    } catch (error) {
      console.error('Error al agregar la característica:', error);
      toast('Hubo un problema, intenta de nuevo', { type: 'error' });
    }
  };

  return (
    <>
      <form
        className="mt-8 mb-2 w-[90%] max-w-screen-lg mx-auto flex flex-col gap-4 "
        onSubmit={handleAddFeature}
      >
        <IconSelector onSelectFeature={handleSelectFeature} />
        <Button
          className="block mx-auto my-6 bg-sky capitalize text-[16px]"
          type="submit"
        >
          Aceptar
        </Button>
      </form>
      <ToastContainer />
    </>
  );
};

export default AddFeature;
