import { useState, useEffect } from "react";
import { getCreditPayments } from "@/api";

export const useCreditPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCreditPayments();
      setPayments(response || []);
    } catch (err) {
      setError("Error al obtener los pagos");
      console.error("Error fetching payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    fetchPayments,
  };
};
