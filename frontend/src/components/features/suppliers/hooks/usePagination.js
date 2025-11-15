import { useState, useEffect, useMemo } from "react";

export const usePagination = (items, initialItemsPerPage = 10) => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: initialItemsPerPage,
    totalItems: 0,
    totalPages: 1,
  });

  // Actualizar totales cuando cambien los items
  useEffect(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage) || 1;

    setPagination((prev) => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages), // Ajustar página si es necesario
    }));
  }, [items.length, pagination.itemsPerPage]);

  // Navegar a una página específica
  const goToPage = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  };

  // Cambiar cantidad de items por página
  const changeItemsPerPage = (newLimit) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: newLimit,
      totalPages: Math.ceil(prev.totalItems / newLimit) || 1,
      currentPage: 1, // Resetear a primera página
    }));
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas con puntos suspensivos
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Calcular índices para slice
  const indexOfLast = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirst = indexOfLast - pagination.itemsPerPage;

  // Items de la página actual
  const currentItems = useMemo(() => {
    return items.slice(indexOfFirst, indexOfLast);
  }, [items, indexOfFirst, indexOfLast]);

  // Ir a la página anterior
  const goToPreviousPage = () => {
    goToPage(pagination.currentPage - 1);
  };

  // Ir a la página siguiente
  const goToNextPage = () => {
    goToPage(pagination.currentPage + 1);
  };

  // Verificar si hay página anterior/siguiente
  const hasPreviousPage = pagination.currentPage > 1;
  const hasNextPage = pagination.currentPage < pagination.totalPages;

  return {
    // Estado de paginación
    pagination,
    
    // Items paginados
    currentItems,
    
    // Acciones de navegación
    goToPage,
    goToPreviousPage,
    goToNextPage,
    changeItemsPerPage,
    
    // Helpers
    getPageNumbers,
    hasPreviousPage,
    hasNextPage,
    
    // Índices útiles
    indexOfFirst,
    indexOfLast,
  };
};