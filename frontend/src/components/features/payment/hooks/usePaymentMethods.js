import { useState, useEffect, useCallback } from "react";
import {
  getPayment,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "@/api";

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPaymentMethods = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPayment();
      setPaymentMethods(res || []);
    } catch (err) {
      setError("Error al cargar métodos de pago");
      setPaymentMethods([]);
      console.error("Error fetching payment methods:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMethod = async (data) => {
    try {
      await createPaymentMethod(data);
      await fetchPaymentMethods();
      return { success: true };
    } catch (err) {
      console.error("Error creating payment method:", err);
      return { success: false, error: "Error al crear método de pago" };
    }
  };

  const updateMethod = async (id, data) => {
    try {
      await updatePaymentMethod(id, data);
      await fetchPaymentMethods();
      return { success: true };
    } catch (err) {
      console.error("Error updating payment method:", err);
      return { success: false, error: "Error al actualizar método de pago" };
    }
  };

  const deleteMethod = async (id) => {
    try {
      await deletePaymentMethod(id);
      await fetchPaymentMethods();
      return { success: true };
    } catch (err) {
      console.error("Error deleting payment method:", err);
      return {
        success: false,
        error: "Error al eliminar método de pago. Puede estar en uso.",
      };
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  return {
    paymentMethods,
    loading,
    error,
    fetchPaymentMethods,
    createMethod,
    updateMethod,
    deleteMethod,
  };
};