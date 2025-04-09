import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import GlobalWhatsAppContactButton from "./Home/components/GlobalWhatsAppContactButton";
import { getReviews } from "../services/reviewService"; // Importa getUsers en lugar de getUser

const Reviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [users, setUsers] = useState([]);

  const fetchReviews = async () => {
    try {
      // Intenta obtener las reseñas desde la API
      let reviewsData = await getReviews(id);

      // Verifica que las reseñas obtenidas sean válidas
      if (!Array.isArray(reviewsData) || reviewsData.length === 0) {
        console.warn("No se obtuvieron reseñas válidas desde la API.");
        setReviews([]); // Si no hay reseñas, se asigna un arreglo vacío
        return;
      }

      // Calcular la calificación promedio
      const totalRating = reviewsData.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      setAverageRating((totalRating / reviewsData.length).toFixed(1));

      // Mapear las reseñas con los nombres de usuario
      const reviewsWithUserName = reviewsData.map((review) => {
        return {
          ...review,
          userName: `${review.firstName} ${review.lastName}`,
        };
      });

      setReviews(reviewsWithUserName);
    } catch (error) {
      console.error("Error al obtener las reseñas:", error);

      // Si ocurre un error, mostramos un mensaje adecuado
      setReviews([]); // Se asigna un arreglo vacío si hay error al obtener las reseñas
      console.error("No se pudieron obtener las reseñas.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  return (
    <section>
      <article className="bg-sky text-white font-medium text-2xl p-6 mt-10">
        <div className="mx-auto flex justify-between max-w-screen-2xl">
          Reseñas
          <Link to={"/"}>
            <IoArrowBackCircleOutline size={30} />
          </Link>
        </div>
      </article>
      <article className="flex flex-col items-center p-6">
        <div className="bg-[#3C6E71] text-white rounded-2xl px-8 py-6 flex flex-col items-center shadow-lg">
          <FaStar className="text-yellow-400 text-7xl" />
          <p className="text-5xl font-bold mt-2">
            {averageRating ? averageRating : "0.0"}
          </p>
        </div>
        <p className="text-center py-5 font-semibold md:text-xl tracking-wider text-[#3C6E71]">
          "Esta calificación es el resultado de la opinión de nuestra
          comunidad."
        </p>
        <hr className="w-full border-t-2 border-gray-300 my-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {reviews && reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg shadow-md bg-white"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      className={
                        starIndex < review.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold mt-2">
                  Usuario: {review.userName || review.userId}
                </p>
                <p className="text-xs text-gray-500">{review.reviewDate}</p>
                {review.comment && (
                  <p className="text-sm mt-2">{review.comment}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No hay reseñas disponibles.
            </p>
          )}
        </div>
      </article>
      <GlobalWhatsAppContactButton message="Quiero saber más sobre las reseñas y calificaciones de los eventos." />
    </section>
  );
};

export default Reviews;
