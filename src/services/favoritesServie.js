import { apiClient } from "./apiClient";

const apiUrl =
  import.meta.env.VITE_API_URL_DEVELOPMENT ||
  import.meta.env.VITE_API_URL_PRODUCTION;

export const getFavoritesProducts = async (userId) => {
  return apiClient(`/favoritos/${userId}`);
};

export const createFavoriteProduct = async (newFavorite) => {
  return apiClient(`/favoritos/agregar`, "POST", newFavorite);
};

export const deleteFavoriteProduct = (deleteFavorite) =>
  apiClient(`/favoritos/eliminar`, "DELETE", deleteFavorite);
