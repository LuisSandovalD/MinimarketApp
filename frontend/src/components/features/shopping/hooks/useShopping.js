import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getShopping,
  createShopping,
  updateShopping,
  deleteShopping,
  getProducts,
  getUserRegister,
  getSupplier,
  getCategories,
} from "@/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function useShopping() {
  // ======= ESTADOS PRINCIPALES =======
  const [shopping, setShopping] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null });

  const [filters, setFilters] = useState({
    search: "",
    supplierId: "",
    userId: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState("cards");

  const location = useLocation();
  const navigate = useNavigate();

  // ======= FORMULARIO =======
  const initialForm = useMemo(
    () => ({
      shopping_number: "",
      user_id: "",
      supplier_id: "",
      date: new Date().toISOString().split("T")[0],
      subtotal: 0,
      vat: 0,
      total: 0,
      notes: "",
      details: [],
    }),
    []
  );

  const [formData, setFormData] = useState(initialForm);

  // ======= CARGA DE DATOS =======
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [shoppingData, productsData, usersData, suppliersData, categoriesData] =
          await Promise.all([
            getShopping(),
            getProducts(),
            getUserRegister(),
            getSupplier(),
            getCategories(),
          ]);
        setShopping(shoppingData);
        setProducts(productsData);
        setUsers(usersData);
        setSuppliers(suppliersData);
        setCategories(categoriesData);
      } catch (err) {
        setError("Error al cargar los datos: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // ======= DETECTA PRODUCTOS DESDE NAVEGACIÓN =======
  useEffect(() => {
    const productIndividual = location.state?.productToPurchase;
    const productsArray = location.state?.selectedProducts;
    let itemsToProcess = [];

    if (productsArray?.length) itemsToProcess = productsArray;
    else if (productIndividual) itemsToProcess = [productIndividual];

    if (itemsToProcess.length > 0) {
      const newDetails = itemsToProcess.map((product) => ({
        product_id: product.id,
        product_name: product.name,
        code: product.code,
        category_id: product.category_id,
        quantity: 1,
        unit_price: product.price,
        subtotal: product.price,
      }));

      const formWithProducts = { ...initialForm, details: newDetails };
      openModal(formWithProducts);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, initialForm, navigate, location.pathname]);

  // ======= MODAL =======
  const openModal = useCallback(
    (item = null) => {
      setEditingItem(item && item.id ? item : null);
      setFormData(item || initialForm);
      setShowModal(true);
    },
    [initialForm]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(initialForm);
  }, [initialForm]);

  // ======= CRUD =======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updated = await updateShopping(editingItem.id, formData);
        setShopping((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updated.data : item))
        );
      } else {
        const created = await createShopping(formData);
        setShopping((prev) => [...prev, created.data]);
      }
      closeModal();
    } catch (err) {
      setError("Error al guardar: " + err.message);
    }
  };

  const confirmDelete = (id) => setConfirmModal({ show: true, id });

  const handleDelete = async () => {
    try {
      await deleteShopping(confirmModal.id);
      setShopping((prev) => prev.filter((item) => item.id !== confirmModal.id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    } finally {
      setConfirmModal({ show: false, id: null });
    }
  };

  // ======= FILTROS =======
  const filteredShopping = useMemo(() => {
    return shopping.filter((item) => {
      const search = filters.search.toLowerCase();
      const total = Number(item.total || 0);

      return (
        (!filters.search ||
          item.shopping_number?.toLowerCase().includes(search) ||
          item.supplier?.name?.toLowerCase().includes(search) ||
          item.user?.name?.toLowerCase().includes(search)) &&
        (!filters.supplierId || item.supplier_id === parseInt(filters.supplierId)) &&
        (!filters.userId || item.user_id === parseInt(filters.userId)) &&
        (!filters.dateFrom || new Date(item.date) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(item.date) <= new Date(filters.dateTo)) &&
        (!filters.minAmount || total >= Number(filters.minAmount)) &&
        (!filters.maxAmount || total <= Number(filters.maxAmount))
      );
    });
  }, [shopping, filters]);

  // ======= PAGINACIÓN =======
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 9,
    totalItems: filteredShopping.length,
    totalPages: Math.ceil(filteredShopping.length / 9),
  });

  useEffect(() => {
    const totalItems = filteredShopping.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    setPagination((prev) => ({ ...prev, totalItems, totalPages }));
  }, [filteredShopping, pagination.itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const changeItemsPerPage = (num) => {
    setPagination((prev) => ({ ...prev, itemsPerPage: num, currentPage: 1 }));
  };

  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");

    return totalPages > 1 ? [1, ...range, totalPages] : [1];
  };

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const paginatedData = filteredShopping.slice(
    startIndex,
    startIndex + pagination.itemsPerPage
  );

  // ======= ESTADÍSTICAS =======
  const stats = useMemo(() => {
    const total = filteredShopping.reduce(
      (acc, item) => acc + Number(item.total || 0),
      0
    );
    return {
      total: total.toFixed(2),
      count: filteredShopping.length,
      average:
        filteredShopping.length > 0
          ? (total / filteredShopping.length).toFixed(2)
          : "0.00",
    };
  }, [filteredShopping]);

  // ======= CONTROL UI =======
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearAllFilters = () =>
    setFilters({
      search: "",
      supplierId: "",
      userId: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
    });

  // ======= RETORNO GENERAL =======
  return {
    shopping,
    products,
    users,
    suppliers,
    categories,
    loading,
    error,
    showModal,
    editingItem,
    confirmModal,
    filters,
    showAdvancedFilters,
    viewMode,
    formData,
    pagination,
    stats,
    paginatedData,

    // funciones
    setViewMode,
    setShowAdvancedFilters,
    handleFilterChange,
    clearAllFilters,
    openModal,
    closeModal,
    handleSubmit,
    confirmDelete,
    handleDelete,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    setFormData,
    setConfirmModal
  };
}
