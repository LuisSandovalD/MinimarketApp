import { useState, useEffect } from "react";
import { getSupplier, deleteSupplier } from "@/api";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSupplier();
      setSuppliers(data);
    } catch (err) {
      setError("No se pudieron cargar los proveedores.");
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeSupplier = async (id) => {
    try {
      await deleteSupplier(id);
      await fetchSuppliers();
      return { success: true };
    } catch (err) {
      console.error("Error deleting supplier:", err);
      return { success: false, error: "No se pudo eliminar el proveedor" };
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    removeSupplier,
  };
};