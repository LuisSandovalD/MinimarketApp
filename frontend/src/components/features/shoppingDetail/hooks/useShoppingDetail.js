import { useState, useEffect, useMemo } from "react";
import { getShoppingDetail } from "@/api";

export const useShoppingDetail = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Obtener datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getShoppingDetail();
        setDetails(data);
        setError(null);
        setCurrentPage(1); // Reiniciar paginación cuando se recargan los datos
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Valores totales
  const totalItems = details.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Datos paginados
  const paginatedDetails = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return details.slice(start, start + itemsPerPage);
  }, [details, currentPage, itemsPerPage]);

  // Cambiar página
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Cambiar cantidad por página
  const changeItemsPerPage = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Generar lista de páginas (1, 2, 3, "...", 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return {
    details,
    loading,
    error,

    // paginación
    paginatedDetails,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
  };
};
