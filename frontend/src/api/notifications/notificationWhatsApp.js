// api/notificationWhatsApp.js
import authRequest from "../core/authRequest";

/**
 * Enviar mensaje de WhatsApp
 * @param {Object} data - Datos del mensaje
 * @param {string} data.to - Número de teléfono con +51
 * @param {string} data.name - Nombre del cliente
 * @param {number} data.total - Total de la venta
 * @param {string} data.fecha - Fecha del comprobante
 * @param {number} data.customer_id - ID del cliente
 * @param {number} data.user_id - ID del usuario
 */
export const postWhatsAppText = async (data) => {
  try {
    console.log("📤Enviando WhatsApp con datos:", data);
    const response = await authRequest("post", "/admin/whatsapp/send", data);
    console.log("✅Respuesta de WhatsApp:", response);
    return response;
  } catch (error) {
    console.error("Error al enviar WhatsApp:", error);
    // Si el error tiene una respuesta del servidor, lanzarla
    if (error.response?.data) {
      throw error.response.data;
    }
    // Si no, lanzar el error original
    throw {
      success: false,
      message: error.message || "Error desconocido al enviar mensaje",
    };
  }
};