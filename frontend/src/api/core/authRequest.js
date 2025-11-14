import api from "./axios";

const authRequest = async (method, url, dataOrOptions = null) => {
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
    };

    // 🔹 Compatibilidad con la forma anterior
    // Si el tercer parámetro NO es un objeto con `params` o `data`, lo tratamos como body directo
    if (dataOrOptions) {
      if (typeof dataOrOptions === "object" && (dataOrOptions.params || dataOrOptions.data)) {
        if (dataOrOptions.data) config.data = dataOrOptions.data;
        if (dataOrOptions.params) config.params = dataOrOptions.params;
      } else if (["post", "put", "patch"].includes(method.toLowerCase())) {
        config.data = dataOrOptions;
      }
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw (
        error.response.data || {
          success: false,
          message: error.response.statusText || "Error del servidor",
        }
      );
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
