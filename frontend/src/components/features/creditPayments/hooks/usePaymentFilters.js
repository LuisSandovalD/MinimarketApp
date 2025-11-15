import { useState, useMemo } from "react";

export const usePaymentFilters = (payments) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, amount
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month

  const filtered = useMemo(() => {
    let result = [...payments];

    // 1. Aplicar búsqueda
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.id.toString().includes(query) ||
          p.credit_id?.toString().includes(query) ||
          p.user?.name?.toLowerCase().includes(query) ||
          p.notes?.toLowerCase().includes(query) ||
          p.credit?.sale?.customer?.name?.toLowerCase().includes(query)
      );
    }

    // 2. Aplicar filtro de fecha
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      result = result.filter((p) => {
        const paymentDate = new Date(p.payment_date);

        switch (dateFilter) {
          case "today":
            return paymentDate >= today;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return paymentDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return paymentDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // 3. Aplicar ordenamiento
    result.sort((a, b) => {
      let aValue, bValue;

      if (sortBy === "amount") {
        aValue = parseFloat(a.amount) || 0;
        bValue = parseFloat(b.amount) || 0;
      } else {
        aValue = new Date(a.payment_date);
        bValue = new Date(b.payment_date);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return result;
  }, [payments, search, sortBy, sortOrder, dateFilter]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const clearFilters = () => {
    setSearch("");
    setSortBy("date");
    setSortOrder("desc");
    setDateFilter("all");
  };

  return {
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    dateFilter,
    setDateFilter,
    filtered,
    clearFilters,
  };
};