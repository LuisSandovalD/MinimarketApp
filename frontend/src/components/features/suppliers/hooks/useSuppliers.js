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
    } catch {
      setError("No se pudieron cargar los proveedores.");
    } finally {
      setLoading(false);
    }
  };

  const removeSupplier = async (id) => {
    try {
      await deleteSupplier(id);
      await fetchSuppliers();
      return { success: true };
    } catch {
      return { success: false };
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