import { Button, Card, Typography } from '@material-tailwind/react';
import DefaultImage from '@assets/image-default.svg';
import { useContext, useEffect, useState } from 'react';
import validationCreateProduct from '../../../../utils/validationCreateProduct';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TbAlertCircle } from 'react-icons/tb';
import ImageUploader from '../../components/AddProduct/components/ImageUploader';
import { uploadImages } from '../../../../utils/uploadToCloudinary';
import { SelectCategory } from './components/SelectCategory';
import { EventContext } from '../../../../context/ProductContext';
import { Checkbox } from '@material-tailwind/react';
import { getFeatures } from '../../../../services/featuresService';

const ProductForm = ({ onSubmit, initialData = {} }) => {
  const { events, fetchEvents } = useContext(EventContext);

  const [inputs, setInputs] = useState({
    name: '',
    price: '',
    description: '',
    features: [],
    fechaInicio: '',
    fechaFin: '',
  });
  
  const [images, setImages] = useState(
    Array(5)
      .fill(null)
      .map(() => ({
        preview: DefaultImage,
        isDefault: true,
      }))
  );
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const currentIdEvent = initialData.id;

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (images.every((img) => !img.isDefault)) {
      setError((prev) => {
        const newError = { ...prev };
        delete newError.images;
        return newError;
      });
    }
  }, [images]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        name: initialData.name ?? '',
        price: initialData.price ?? '',
        description: initialData.description ?? '',
        categoryOutputDTO: initialData.categoryOutputDTO?.name ?? '',
        features: initialData.features ?? [],
        fechaInicio: initialData.fechaInicio ?? '',
        fechaFin: initialData.fechaFin ?? '',
      }));

      setImages(
        initialData.images?.map((url) => ({
          preview: url,
          isDefault: false,
        })) ?? []
      );

      setSelectedCategory(initialData.categoryOutputDTO?.id_category ?? 0);

      const numericData = initialData.features.map((feature) =>
        Number(feature.id)
      );
      setSelectedFeatures(numericData);
    }
  }, [initialData]);

  // Cargar características desde la base de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeatures();
        setAvailableFeatures(data);
      } catch (error) {
        console.error('Error al cargar las características', error);
      }
    };
    fetchData();
  }, []);

  const handleInputsChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const updatedInputs = {
      ...inputs,
      [name]: value,
    };

    setInputs(updatedInputs);

    // Primero, validamos los campos y actualizamos los errores
    let newErrors = validationCreateProduct(
      updatedInputs,
      selectedCategory,
      selectedFeatures
    );

    // Verificamos si el nombre ya existe
    if (name === 'name') {
      const nameExists = events.some(
        (event) => event.name.toLowerCase() === value.toLowerCase()
      );

      if (nameExists) {
        newErrors.nameRepeat = 'El nombre ya está en uso';
      }
    }

    const cleanedErrors = { ...error };
    Object.keys(error).forEach((key) => {
      if (!newErrors[key]) delete cleanedErrors[key];
    });

    // Actualizar el estado con los errores limpios
    setError({ ...cleanedErrors, ...newErrors });
  };

  const handleGetCategory = (category) => {
    setSelectedCategory(category.id_category);
  };

  const handleCheckFeature = (e) => {
    const { checked, value } = e.target;
    const numberValue = parseInt(value);
    setSelectedFeatures((prevFeatures) => {
      const updatedFeatures = checked
        ? [...prevFeatures, numberValue]
        : prevFeatures.filter((feature) => feature !== numberValue);

      setError((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (updatedFeatures.length > 0) {
          delete newErrors.features;
        }
        return newErrors;
      });

      return updatedFeatures;
    });
  };

  const handleSubmitNewProduct = async (e) => {
    e.preventDefault();

    const errors = validationCreateProduct(inputs);

    if (images.some((image) => image.isDefault)) {
      errors.images = 'Debes agregar por lo menos 5 imágenes para tu evento';
    }

    const nameExists = events.some(
      (event) =>
        event.name.toLowerCase() === inputs.name.toLowerCase() &&
        event.id !== currentIdEvent
    );

    if (nameExists) {
      errors.nameRepeat = 'El nombre ya está en uso';
    }

    if (selectedCategory === 0) {
      errors.categoryId = 'Debes elegir una categoría';
    }

    if (!selectedFeatures.length) {
      errors.features = 'Debes seleccionar al menos una característica';
    } else {
      delete errors.features;
    }

  
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      // Identificar imágenes existentes y nuevas a Cloudinary
      const existingImages = images
        .filter((img) => img.preview.startsWith('https://res.cloudinary.com'))
        .map((img) => img.preview);

      const newImages = images.filter(
        (img) => !img.preview.startsWith('https://res.cloudinary.com')
      );

      // Subir solo imágenes nuevas a Cloudinary
      const uploadedImages = newImages.length
        ? await uploadImages(newImages)
        : [];

      if (uploadedImages.some((url) => !url)) {
        toast('Error al subir algunas imágenes', { type: 'error' });
        return;
      }

      const imageUrls = [...existingImages, ...uploadedImages];

      const newProduct = {
        name: inputs.name,
        price: inputs.price,
        description: inputs.description,
        images: imageUrls,
        categoryId: selectedCategory,
        featureIds: selectedFeatures,
        fechaInicio: inputs.fechaInicio,
        fechaFin: inputs.fechaFin,
      };
      console.log('Datos enviados al servidor:', newProduct);
      const errorSubmit = onSubmit(newProduct);

      if (!errorSubmit) {
        setInputs({ name: '', price: '', description: '' });
      }

      setError({});
      setIsLoading(true);
    } catch (error) {
      console.error('Error creando el evento:', error);
      toast('Hubo un problema, intenta de nuevo', { type: 'error' });
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col items-center pt-3">
      {/* Componente de las Imagenes */}
      <ImageUploader
        images={images}
        setImages={setImages}
        error={error}
        setError={setError}
      />

      <Card className="w-full max-w-[600px] my-5">
        <form
          className="mt-8 mb-2 w-[90%] max-w-screen-lg mx-auto "
          onSubmit={handleSubmitNewProduct}
        >
          <div className="mb-1 flex flex-col gap-3">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Nombre del Evento
            </Typography>
            <input
              placeholder="Tours de Tecnología"
              name="name"
              onChange={handleInputsChange}
              value={inputs.name}
              className="placeholder:text-gray-500 border-2 rounded-lg py-2 px-4 focus:outline-none focus:border-teal-300"
            />
            {error.name && (
              <p className="text-red-400 flex items-center gap-2">
                <TbAlertCircle color="red" />
                {error.name}
              </p>
            )}
            {error.nameRepeat && (
              <p className="text-red-400 flex items-center gap-2">
                <TbAlertCircle color="red" />
                {error.nameRepeat}
              </p>
            )}

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Precio del Evento
            </Typography>
            <input
              type="number"
              placeholder="500 USD"
              name="price"
              onChange={handleInputsChange}
              value={inputs.price}
              className="placeholder:text-gray-500 border-2 rounded-lg py-2 px-4 focus:outline-none focus:border-teal-300"
            />
            {error.price && (
              <p className="text-red-400 flex items-center gap-2">
                <TbAlertCircle color="red" />
                {error.price}
              </p>
            )}

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Seleciona una Categoría
            </Typography>
            {/* Componente que maneja la lista de categorias */}
            <SelectCategory
              onGetCategory={handleGetCategory}
              initialData={initialData}
              setError={setError}
              error={error}
            />
            {error.categoryId && (
              <p className="text-red-400 flex items-center gap-2">
                <TbAlertCircle color="red" />
                {error.categoryId}
              </p>
            )}

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Características
            </Typography>
            <div className="py-5 pl-8 grid grid-cols-3 gap-3 place-items-start ">
              {availableFeatures.map((feature) => (
                <label
                  key={feature.id}
                  className="flex items-center capitalize"
                >
                  <span>{feature.name}</span>
                  <Checkbox
                    color="blue"
                    value={feature.id}
                    onChange={handleCheckFeature}
                    checked={selectedFeatures.includes(Number(feature.id))}
                  />
                </label>
              ))}
            </div>
            {error.features && (
              <p className="text-red-400 flex items-center gap-2">
                <TbAlertCircle color="red" />
                {error.features}
              </p>
            )}

            <div className="flex justify-between gap-2">
              <div className="flex-1">
                <Typography variant="h6" color="blue-gray">
                  Fecha Inicial
                </Typography>
                <input
                  type="date"
                  className="w-full p-3 border-2 border-robineggblue dark:border-none rounded-md outline-none dark:text-black focus:border-teal-300"
                  onChange={handleInputsChange}
                  name="fechaInicio"
                  value={inputs.fechaInicio}
                />
                {error.fechaInicio && (
                  <p className="text-red-400 flex items-center gap-2">
                    <TbAlertCircle color="red" />
                    {error.fechaInicio}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Typography variant="h6" color="blue-gray">
                  Fecha Final
                </Typography>
                <input
                  type="date"
                  className="w-full p-3 border-2 border-robineggblue dark:border-none rounded-md outline-none dark:text-black focus:border-teal-300"
                  onChange={handleInputsChange}
                  name="fechaFin"
                  value={inputs.fechaFin}
                />
                 {error.fechaFin && (
                  <p className="text-red-400 flex items-center gap-2">
                    <TbAlertCircle color="red" />
                    {error.fechaFin}
                  </p>
                )}
              </div>
            </div>

            <Typography variant="h6" color="blue-gray">
              Descripción
            </Typography>
            <textarea
              placeholder="Evento a nivel mundial.."
              name="description"
              onChange={handleInputsChange}
              value={inputs.description}
              className="placeholder:text-gray-500 placeholder:pl-1 border-2 rounded-lg pl-2 h-40 py-2 focus:outline-none focus:border-teal-300"
            />
          </div>
          {error.description && (
            <p className="text-red-400 flex items-center gap-2">
              <TbAlertCircle color="red" />
              {error.description}
            </p>
          )}

          <Button
            className="block mx-auto my-6 bg-sky capitalize text-[16px]"
            type="submit"
            disabled={Object.keys(error).length > 0 || isLoading}
          >
            {Object.keys(initialData)?.length
              ? 'Actualizar Evento'
              : 'Crear Evento'}
          </Button>
        </form>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default ProductForm;
