export const submitReview = async (reviewData) => {
  const apiUrl =
    import.meta.env.VITE_API_URL_DEVELOPMENT ||
    import.meta.env.VITE_API_URL_PRODUCTION;
  try {
    const response = await fetch(`${apiUrl}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al enviar la reseña:", errorData);
      throw new Error(
        `Error: ${response.status} - ${
          errorData.message || response.statusText
        }`
      );
    }

    const result = await response.json();
    return result; // Si es necesario, procesar la respuesta del servidor
  } catch (error) {
    console.error("Error al enviar la reseña:", error);
    throw error; // Para que puedas manejar el error en el componente
  }
};

export const getReviews = async (id) => {
  const apiUrl =
    import.meta.env.VITE_API_URL_DEVELOPMENT ||
    import.meta.env.VITE_API_URL_PRODUCTION;
  try {
    const response = await fetch(`${apiUrl}/reviews/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las reseñas");
    }

    const result = await response.json();
    return result; // Devuelve las reseñas de la respuesta
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    throw error; // Lanza el error para que lo maneje el componente
  }
};
