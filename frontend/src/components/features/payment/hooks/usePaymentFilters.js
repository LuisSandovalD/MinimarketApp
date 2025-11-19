import { useState, useMemo } from "react";

export const usePaymentFilters = (paymentMethods) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  const filtered = useMemo(() => {
    return paymentMethods.filter((method) => {
      const matchesSearch = [method.name, method.description]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && method.active) ||
        (filterStatus === "inactive" && !method.active);

      return matchesSearch && matchesStatus;
    });
  }, [paymentMethods, search, filterStatus]);

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  return {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filtered,
    clearFilters,
  };
};