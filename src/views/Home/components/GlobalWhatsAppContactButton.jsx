import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const GlobalWhatsAppContactButton = ({ 
  message = 'Tengo algunas consultas generales', 
  phoneNumber = '+573025465848' 
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState(null);

  const handleWhatsAppContact = () => {
    try {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      setShowNotification(true);
      setError(null);
      
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'No se pudo abrir WhatsApp. Por favor, intente nuevamente.');
      console.error('WhatsApp contact error:', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={handleWhatsAppContact}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
          aria-label="Contactar por WhatsApp"
        ><FaWhatsapp size={24}/>
        </button>

        {showNotification && (
          <div className="absolute top-[-50px] right-0 bg-green-100 text-green-700 px-3 py-2 rounded-lg shadow-md">
            ¡Chat de WhatsApp abierto con éxito!
          </div>
        )}

        {error && (
          <div className="absolute top-[-50px] right-0 bg-red-100 text-red-700 px-3 py-2 rounded-lg shadow-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalWhatsAppContactButton;