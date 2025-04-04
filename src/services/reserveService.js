export const createReservation = async (reservationData, token) => {
  const apiUrl =
    import.meta.env.VITE_API_URL_DEVELOPMENT ||
    import.meta.env.VITE_API_URL_PRODUCTION;
  try {
    const response = await fetch(`${apiUrl}/reservas/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      throw new Error("Error al registrar la reserva");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    throw error;
  }
};

export const getReservations = async (token) => {
  try {
    const response = await fetch(`${apiUrl}/reservas/listar-usuario`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener reservas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getReservations:", error);
    return [];
  }
};
