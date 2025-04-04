import { apiClient } from "./apiClient";

export const getCategories = async () => {
  return apiClient("/categorias");
};

export const createCategory = async (newProduct) => {
  return apiClient("/categorias/registrar", "POST", newProduct);
};

export const getCategoryById = (id) => apiClient(`/categorias/${id}`);

export const deleteCategory = async (eventId) => {
  const apiUrl =
    import.meta.env.VITE_API_URL_DEVELOPMENT ||
    import.meta.env.VITE_API_URL_PRODUCTION;
  const response = await fetch(`${apiUrl}/categorias/${eventId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Error al eliminar la característica: ${response.statusText}`
    );
  }

  return response.text();
};
