import { useState, useMemo } from "react";

export const useShoppingFilters = (details) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShopping, setSelectedShopping] = useState("");
  const [sortBy, setSortBy] = useState("shopping_id");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredDetails = useMemo(() => {
    let filtered = [...details];

    // Aplicar búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (detail) =>
          detail.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          detail.product?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          detail.shopping?.shopping_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          detail.shopping_id?.toString().includes(searchTerm) ||
          detail.product_id?.toString().includes(searchTerm)
      );
    }

    // Filtrar por compra
    if (selectedShopping) {
      filtered = filtered.filter(
        (detail) => detail.shopping_id?.toString() === selectedShopping
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "shopping_id":
          aVal = a.shopping_id || 0;
          bVal = b.shopping_id || 0;
          break;
        case "product":
          aVal = a.product?.name || "";
          bVal = b.product?.name || "";
          return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case "quantity":
          aVal = parseFloat(a.quantity) || 0;
          bVal = parseFloat(b.quantity) || 0;
          break;
        case "price":
          aVal = parseFloat(a.unit_price) || 0;
          bVal = parseFloat(b.unit_price) || 0;
          break;
        default:
          aVal = a.id;
          bVal = b.id;
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [details, searchTerm, selectedShopping, sortBy, sortOrder]);

  const uniqueShoppings = useMemo(() => {
    return details
      .filter(d => d.shopping)
      .map(d => ({ id: d.shopping_id, number: d.shopping.shopping_number }))
      .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
      .sort((a, b) => b.id - a.id);
  }, [details]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedShopping("");
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedShopping,
    setSelectedShopping,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredDetails,
    uniqueShoppings,
    clearFilters,
    toggleSort,
  };
};