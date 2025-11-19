import api from "../core/axios";

// Verificar si el email existe
export const checkEmail = async (email) => {
  const response = await api.post("/check-email", { email });
  return response.data;
};

// Registro de usuario
export const register = async (data) => {
  const response = await api.post("/register", data);
  return response.data;
};

// Login
export const login = async (data) => {
  const response = await api.post("/login", data);
  const { access_token } = response.data;

  // Guarda token en localStorage para futuras peticiones
  if (access_token) {
    localStorage.setItem("token", access_token);
  }

  return response.data;
};

// Logout
export const logout = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const response = await api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Limpia el token almacenado
  localStorage.removeItem("token");
  return response.data;
};

// Obtener usuario autenticado
export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token activo");

  const response = await api.get("/admin/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Solicitar enlace de recuperación de contraseña
export const forgotPassword = async (email) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};

// Restablecer contraseña
export const resetPassword = async (data) => {
  const response = await api.post("/reset-password", data);
  return response.data;
};

// Verificar correo electrónico
export const verifyEmail = async (id, hash, token) => {
  const response = await api.get(`/verify-email/${id}/${hash}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Reenviar correo de verificación
export const resendVerification = async () => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    "/email/verification-notification",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Ping de prueba (para comprobar conexión API)
export const ping = async () => {
  const response = await api.get("/ping");
  return response.data;
};