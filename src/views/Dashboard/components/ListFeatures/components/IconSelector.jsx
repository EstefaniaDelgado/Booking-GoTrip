import { useState } from 'react';
import { FaPlane, FaHotel, FaCamera, FaWifi, FaGifts  } from 'react-icons/fa';
import { IoFastFoodSharp } from 'react-icons/io5';
import { MdOutlineEmojiTransportation } from 'react-icons/md';


const icons = [
  { name: 'Tiquetes', icon: <FaPlane /> },
  { name: 'Alimentos', icon: <IoFastFoodSharp /> },
  { name: 'Hospedaje', icon: <FaHotel /> },
  { name: 'Wifi', icon: <FaWifi /> },
  { name: 'Entretenimiento', icon: <FaCamera /> },
  { name: 'Transporte', icon: <MdOutlineEmojiTransportation /> },
  { name: 'Merchandise', icon: <FaGifts /> },
];

const IconSelector = ({onSelectFeature}) => {
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleSelect = (name) => {
    setSelectedIcon(name);
    onSelectFeature(name)
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border mt-3 border-b-4 border-blue-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Selecciona un ícono
      </h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {icons.map(({ name, icon }) => (
          <button
            type="button"
            key={name}
            onClick={() => handleSelect(name)}
            className={`text-2xl p-4 border-2 rounded-lg transition-all 
              ${
                selectedIcon === name
                  ? 'bg-blue-100 border-blue-500 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {icon}
          </button>
        ))}
      </div>

      {selectedIcon && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Caracteristica seleccionada:{' '}
          <span className="font-medium">{selectedIcon}</span>
        </p>
      )}
    </div>
  );
};

export default IconSelector;
