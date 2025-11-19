import { useState, useEffect } from "react";
import { getSalesDetail } from "@/api";

export const useSaleDetails = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSalesDetail();
      setDetails(data || []);
    } catch (err) {
      setError("Error al cargar detalles");
      console.error("Error fetching sale details:", err);
      setDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return {
    details,
    loading,
    error,
    fetchDetails,
  };
};