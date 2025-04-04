import { apiClient } from "./apiClient";

export const getFeatures = async () => {
  return apiClient("/features");
};

export const createFeatures = async (newFeatures) => {
  return apiClient("/features", "POST", newFeatures);
};

export const updateFeatures = (id, updateFeatures) =>
  apiClient(`/features/${id}`, "PUT", updateFeatures);

export const getFeaturesById = (id) => apiClient(`/features/${id}`);

export const deleteFeatures = async (eventId) => {
  const apiUrl =
    import.meta.env.VITE_API_URL_DEVELOPMENT ||
    import.meta.env.VITE_API_URL_PRODUCTION;

  const response = await fetch(`${apiUrl}/features/${eventId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Error al eliminar la característica: ${response.statusText}`
    );
  }

  return response.text();
};
