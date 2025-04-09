import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaTimes,
  FaLink,
  FaXing,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShareProduct = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const apiUrl =
    import.meta.env.VITE_API_URL_DEVELOPMENT ||
    import.meta.env.VITE_API_URL_PRODUCTION;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/productos/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener el producto:", err);
        setError("No se pudo cargar la información del producto");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const copyToClipboard = () => {
    if (!product) return;
    const shareUrl = `${window.location.origin}/detail/${product.id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Enlace del evento copiado al portapapeles");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      })
      .catch(() => {
        toast.error("No se pudo copiar el enlace");
        setCopySuccess(false);
      });
  };

  const shareToSocial = (network) => {
    if (!product) return;
    const shareUrl = `${window.location.origin}/detail/${product.id}`;
    const shareContent = {
      title: product.name,
      text: message || `¡Mira este evento: ${product.name}!`,
      url: shareUrl,
    };

    let socialShareUrl;

    switch (network) {
      case "facebook":
        socialShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareContent.url
        )}&quote=${encodeURIComponent(shareContent.text)}`;
        toast.info("Ventana de Facebook abierta");
        window.open(socialShareUrl, "_blank", "width=600,height=400");
        break;
      case "twitter":
        socialShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
          shareContent.text
        )}&url=${encodeURIComponent(shareContent.url)}`;
        toast.info("Ventana de X abierta");
        window.open(socialShareUrl, "_blank", "width=600,height=400");
        break;
      case "whatsapp":
        socialShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          shareContent.text + " " + shareContent.url
        )}`;
        toast.info("WhatsApp abierto");
        window.open(socialShareUrl, "_blank", "width=600,height=400");
        break;
      case "instagram":
        toast.info("Instagram no permite compartir directamente desde la web", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          navigator.clipboard.writeText(shareContent.url);
          toast.success(
            "Enlace copiado. Puedes pegarlo manualmente en Instagram.",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }, 1000);
        break;
      default:
        return;
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return null;

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 flex items-center justify-center z-50 p-4
        ${isVisible ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <ToastContainer />

      <div
        className={`bg-white rounded-lg shadow-lg max-w-md w-full transition-all duration-300 max-h-[90vh] overflow-y-auto
          ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform -translate-y-8"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-3 bg-white border-b">
          <h3 className="text-lg font-medium text-gray-800">
            Comparte este evento
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex items-center p-3 bg-gray-50">
          <div className="w-17 h-16 mr-3 bg-gray-200 rounded overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://via.placeholder.com/150?text=No+Imagen"
                alt="No Image"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-base text-gray-800">
              {product.name}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {product.description || "Sin descripción disponible"}
            </p>
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-base font-medium text-gray-800 mb-2">
            Mensaje personalizado
          </h3>
          <textarea
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Escribe un mensaje para acompañar al contenido que deseas compartir"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="p-3">
          <h3 className="text-base font-medium text-gray-800 mb-2">
            Compartir en redes sociales
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => shareToSocial("facebook")}
              className="flex items-center justify-center py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaFacebook className="mr-2" size={16} /> Facebook
            </button>

            <button
              onClick={() => shareToSocial("twitter")}
              className="flex items-center justify-center py-2 px-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaXing className="mr-2" size={16} /> X (Twitter)
            </button>

            <button
              onClick={() => shareToSocial("whatsapp")}
              className="flex items-center justify-center py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="mr-2" size={16} /> WhatsApp
            </button>

            <button
              onClick={() => shareToSocial("instagram")}
              className="flex items-center justify-center py-2 px-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <FaInstagram className="mr-2" size={16} /> Instagram
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className={`flex items-center justify-center py-2 px-3 w-full bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg transition-colors text-sm`}
          >
            <FaLink className="mr-2" size={16} />
            {copySuccess ? "¡Enlace copiado!" : "Copiar enlace del evento"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareProduct;
