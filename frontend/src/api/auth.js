import api from "./axios"; // 👈 IMPORTANTE: importar axios base

// Registro de usuario
export const register = async (data) => {
  const response = await api.post("/register", data);
  return response.data;
};

// Login
export const login = async (data) => {
  const response = await api.post("/login", data);
  return response.data;
};

// Logout
export const logout = async (token) => {
  const response = await api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Obtener usuario autenticado
export const getUser = async (token) => {
  const response = await api.get("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
