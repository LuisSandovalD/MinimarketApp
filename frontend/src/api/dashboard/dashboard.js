import authRequest from "../core/authRequest";

export const getDashboardData = async (start = null, end = null) => {
  try {
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;

    const data = await authRequest("get", "/admin/dashboard/data", { params });
    return data;
  } catch (error) {
    console.error("Error al obtener los datos del dashboard:", error);
    throw error;
  }
};
