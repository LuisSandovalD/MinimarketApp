import { useState, useMemo } from "react";

export const useSupplierFilters = (suppliers) => {
  // Estados de filtrado
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterHasEmail, setFilterHasEmail] = useState("all");
  const [filterHasPhone, setFilterHasPhone] = useState("all");
  
  // Estados de ordenamiento
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Calcular proveedores filtrados y ordenados
  const filtered = useMemo(() => {
    let result = [...suppliers];
    const query = search.toLowerCase().trim();

    // 1. Aplicar búsqueda
    if (query) {
      result = result.filter((supplier) => {
        const searchFields = [
          supplier.name,
          supplier.ruc,
          supplier.email,
          supplier.phone,
          supplier.address,
        ].map((field) => (field || "").toLowerCase());

        return searchFields.some((field) => field.includes(query));
      });
    }

    // 2. Filtrar por estado (activo/inactivo)
    if (filterStatus !== "all") {
      result = result.filter((supplier) =>
        filterStatus === "active" ? supplier.active : !supplier.active
      );
    }

    // 3. Filtrar por email
    if (filterHasEmail !== "all") {
      result = result.filter((supplier) => {
        const hasEmail = supplier.email && supplier.email.trim() !== "";
        return filterHasEmail === "yes" ? hasEmail : !hasEmail;
      });
    }

    // 4. Filtrar por teléfono
    if (filterHasPhone !== "all") {
      result = result.filter((supplier) => {
        const hasPhone = supplier.phone && supplier.phone.trim() !== "";
        return filterHasPhone === "yes" ? hasPhone : !hasPhone;
      });
    }

    // 5. Aplicar ordenamiento
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "ruc":
          aValue = a.ruc || "";
          bValue = b.ruc || "";
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "phone":
          aValue = a.phone || "";
          bValue = b.phone || "";
          break;
        case "name":
        default:
          aValue = (a.name || "").toLowerCase();
          bValue = (b.name || "").toLowerCase();
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return result;
  }, [suppliers, search, filterStatus, filterHasEmail, filterHasPhone, sortBy, sortOrder]);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    return [
      filterStatus !== "all",
      filterHasEmail !== "all",
      filterHasPhone !== "all",
    ].filter(Boolean).length;
  }, [filterStatus, filterHasEmail, filterHasPhone]);

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilterStatus("all");
    setFilterHasEmail("all");
    setFilterHasPhone("all");
    setSortBy("name");
    setSortOrder("asc");
    setSearch("");
  };

  // Alternar orden ascendente/descendente
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return {
    // Estados
    search,
    filterStatus,
    filterHasEmail,
    filterHasPhone,
    sortBy,
    sortOrder,
    
    // Setters
    setSearch,
    setFilterStatus,
    setFilterHasEmail,
    setFilterHasPhone,
    setSortBy,
    
    // Acciones
    toggleSortOrder,
    clearFilters,
    
    // Datos calculados
    filtered,
    activeFiltersCount,
  };
};