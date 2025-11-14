import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from "@/api";

// --- Lógica de Paginación ---
const usePagination = (itemsPerPage = 9) => {
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: itemsPerPage,
        totalItems: 0,
        totalPages: 1,
    });

    const goToPage = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: Math.max(1, Math.min(page, prev.totalPages)),
        }));
    };

    const changeItemsPerPage = (newLimit) => {
        setPagination((prev) => ({
            ...prev,
            itemsPerPage: newLimit,
            totalPages: Math.ceil(prev.totalItems / newLimit),
            currentPage: 1,
        }));
    };

    const getPageNumbers = () => {
        const { currentPage, totalPages } = pagination;
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, currentPage + 2);

            if (start > 1) pages.push(1, "...");
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages) pages.push("...", totalPages);
        }
        return pages;
    };

    return { pagination, setPagination, goToPage, changeItemsPerPage, getPageNumbers };
};

// --- Hook Principal ---
export default function useProductList() {
    // --- Estados Principales ---
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // --- Estados de UI y Filtros ---
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedItems, setSelectedItems] = useState([]);

    // --- Hook de Paginación ---
    const { pagination, setPagination, goToPage, changeItemsPerPage, getPageNumbers } = usePagination(9);

    // --- Cargar Productos (API) ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setFiltered(data);
            } catch (err) {
                setError("Error cargando productos: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // --- Filtrado, Búsqueda y Orden (Efecto Principal) ---
    useEffect(() => {
        let result = [...products];
        const query = search.toLowerCase();

        if (query) {
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.code.toLowerCase().includes(query) ||
                    p.category?.name?.toLowerCase().includes(query)
            );
        }

        if (filterStatus !== "all") {
            result = result.filter((p) =>
                filterStatus === "active" ? p.active : !p.active
            );
        }

        result.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case "price":
                    aValue = a.price || 0;
                    bValue = b.price || 0;
                    break;
                case "stock":
                    aValue = a.stock_current || 0;
                    bValue = b.stock_current || 0;
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
            }
            return sortOrder === "asc"
                ? (aValue > bValue ? 1 : -1)
                : (aValue < bValue ? 1 : -1);
        });

        setFiltered(result);
        // Reset pagination on filter change
        setPagination((prev) => ({
            ...prev,
            totalItems: result.length,
            totalPages: Math.ceil(result.length / prev.itemsPerPage),
            currentPage: 1,
        }));
    }, [search, products, filterStatus, sortBy, sortOrder, setPagination]);

    // --- Handlers y Datos Memoizados ---
    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const handleSelectItem = useCallback((itemId) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(itemId)) {
                return prevSelected.filter(id => id !== itemId);
            } else {
                return [...prevSelected, itemId];
            }
        });
    }, []);

    // Productos de la página actual
    const currentProducts = useMemo(() => {
        const { currentPage, itemsPerPage } = pagination;
        const indexOfLast = currentPage * itemsPerPage;
        const indexOfFirst = indexOfLast - itemsPerPage;
        return filtered.slice(indexOfFirst, indexOfLast);
    }, [filtered, pagination]);

    // Estadísticas
    const stats = useMemo(() => ({
        total: products.length,
        active: products.filter((p) => p.active).length,
        inactive: products.filter((p) => !p.active).length,
        lowStock: products.filter((p) => (p.stock_current || 0) < 2).length,
    }), [products]);

    // Valor total del inventario
    const totalInventoryValue = useMemo(() => 
        filtered.reduce(
            (acc, item) => acc + (item.price || 0) * (item.stock_current || 0), 0
        ).toFixed(2),
    [filtered]);

    // Navegación
    const handleSendSelectedData = useCallback(() => {
        if (selectedItems.length === 0) {
            alert("No hay productos seleccionados para enviar.");
            return;
        }
        const selectedProductObjects = products.filter(p => selectedItems.includes(p.id));
        navigate('/shopping-list', {
            state: { selectedProducts: selectedProductObjects }
        });
    }, [selectedItems, products, navigate]);

  

    // --- Retorno del Hook ---
    return {
        loading,
        error,
        products,
        filtered,
        currentProducts,
        stats,
        totalInventoryValue,
        viewMode,
        setViewMode,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        sortBy,
        setSortBy,
        sortOrder,
        toggleSortOrder,
        pagination,
        goToPage,
        changeItemsPerPage,
        getPageNumbers,
        selectedItems,
        setSelectedItems,
        handleSelectItem,
        handleSendSelectedData,
    };
}