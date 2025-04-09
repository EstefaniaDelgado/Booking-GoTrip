import HeartFilled from "@assets/heartFilled.png";
import HeartUnfilled from "@assets/heartUnfilled.png";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import {
  createFavoriteProduct,
  deleteFavoriteProduct,
  getFavoritesProducts,
} from "../../../services/favoritesServie";
import { Spinner } from "@material-tailwind/react";

const HeartFavorite = ({ event, favorites, setFavorites }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { pathname } = useLocation();
  const { id } = useParams(); // id del producto
  const { token } = JSON.parse(localStorage.getItem("userGoTrip")) || {};
  const storedUser = JSON.parse(localStorage.getItem("userGoTrip")) || {};
  const idUser = storedUser?.user?.id;

  useEffect(() => {
    const isFavorite = favorites?.some((fav) => fav.id === event.id);
    setIsLiked(isFavorite);
  }, [favorites, event]);

  const handleToggleLike = async () => {
    if (!token || isLoading) return;

    setIsLoading(true);

    const sendInfo = {
      productId: event.id,
      userId: idUser,
    };

    try {
      if (isLiked) {
        await deleteFavoriteProduct(sendInfo);
      } else {
        await createFavoriteProduct(sendInfo);
      }

      const updatedFavorites = await getFavoritesProducts(idUser);
      setFavorites([...updatedFavorites]);

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${
        token ? "cursor-pointer" : "cursor-not-allowed"
      } absolute bg-white/60 p-2 rounded-full ${
        pathname === `/Detail/${id}` ? "" : "top-2 right-2"
      }`}
      onClick={handleToggleLike}
    >
      {isLoading ? (
        <Spinner className="w-6" color="blue" />
      ) : (
        <img
          src={isLiked ? HeartFilled : HeartUnfilled}
          alt="icono-corazón"
          className="w-6 hover:scale-105"
        />
      )}
    </div>
  );
};

export default HeartFavorite;
