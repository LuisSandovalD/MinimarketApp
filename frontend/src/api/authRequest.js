import api from "./axios";

const authRequest = async (method, url, data = null) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token activo. Por favor inicia sesión.");
    }

    const config = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...(data && { data }),
    };

    const response = await api(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data || {
        success: false,
        message: error.response.statusText || "Error del servidor",
      };
    }

    if (error.request) {
      throw {
        success: false,
        message: "No se pudo conectar con el servidor. Verifica tu conexión.",
      };
    }

    throw {
      success: false,
      message: error.message || "Error desconocido",
    };
  }
};

export default authRequest;
