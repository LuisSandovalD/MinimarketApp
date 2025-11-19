import { useState, useMemo } from "react";

export const useSaleDetailFilters = (details) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [saleFilter, setSaleFilter] = useState("");

  const filtered = useMemo(() => {
    return details.filter((detail) => {
      const matchesSearch =
        searchTerm === "" ||
        detail.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.product?.code?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "" || detail.product?.category === categoryFilter;

      const matchesSale =
        saleFilter === "" || detail.sale?.id?.toString() === saleFilter;

      return matchesSearch && matchesCategory && matchesSale;
    });
  }, [details, searchTerm, categoryFilter, saleFilter]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    return [
      ...new Set(details.map((d) => d.product?.category).filter(Boolean)),
    ].sort();
  }, [details]);

  // Obtener ventas únicas
  const sales = useMemo(() => {
    return [
      ...new Set(details.map((d) => d.sale?.id).filter(Boolean)),
    ].sort((a, b) => a - b);
  }, [details]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setSaleFilter("");
  };

  const hasActiveFilters = searchTerm || categoryFilter || saleFilter;

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    saleFilter,
    setSaleFilter,
    filtered,
    categories,
    sales,
    clearFilters,
    hasActiveFilters,
  };
};