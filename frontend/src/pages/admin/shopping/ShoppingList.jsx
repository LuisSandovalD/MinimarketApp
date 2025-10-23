import React, { useEffect, useState, useCallback, useMemo } from "react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import {
  getShopping,
  createShopping,
  updateShopping,
  deleteShopping,
} from "../../../api/shopping";
import { getProducts } from "../../../api/product";
import { getUserRegister } from "../../../api/user";
import { getSupplier } from "../../../api/supplier";
import { getCategories } from "../../../api/category";
import ShoppingModal from "../../../components/modals/ModalShopping";
import {
  Search,
  Plus,
  Filter,
  Calendar,
  User,
  Building2,
  DollarSign,
  Edit,
  Trash2,
  ShoppingCart,
  Download,
  Eye,
  FileText,
  TrendingUp,
  Package
} from "lucide-react";
import Loading from "../../../components/common/Loading";


const ShoppingList = () => {
  const [shopping, setShopping] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' o 'table'

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

  useEffect(() => {
    const fetchShopping = async () => {
      try {
        const shoppingData = await getShopping();
        setShopping(shoppingData);
      } catch (err) {
        setError("Error cargando compras: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShopping();
  }, []);

  useEffect(() => {
    const fetchRelatedData = async () => {
      setLoadingData(true);
      try {
        const [productsData, usersData, suppliersData, categoriesData] =
          await Promise.all([
            getProducts(),
            getUserRegister(),
            getSupplier(),
            getCategories(),
          ]);
        setProducts(productsData);
        setUsers(usersData);
        setSuppliers(suppliersData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error al obtener datos secundarios:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchRelatedData();
  }, []);

  const openModal = useCallback(
    (item = null) => {
      setEditingItem(item);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updated = await updateShopping(editingItem.id, formData);
        setShopping((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? updated.data : item
          )
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

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta compra?")) return;

    try {
      await deleteShopping(id);
      setShopping((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  // Filtrado de compras
  const filteredShopping = useMemo(() => {
    return shopping.filter((item) => {
      const matchesSearch =
        item.shopping_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSupplier = selectedSupplier
        ? item.supplier_id === parseInt(selectedSupplier)
        : true;

      const matchesDate = dateFilter ? item.date === dateFilter : true;

      return matchesSearch && matchesSupplier && matchesDate;
    });
  }, [shopping, searchTerm, selectedSupplier, dateFilter]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = filteredShopping.reduce(
      (acc, item) => acc + Number(item.total || 0),
      0
    );
    return {
      total: total.toFixed(2),
      count: filteredShopping.length,
      average: filteredShopping.length > 0 ? (total / filteredShopping.length).toFixed(2) : "0.00",
    };
  }, [filteredShopping]);

  if (loading) return <Loading/>;
  

  if (error) {
    return (
      <main className="mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen lg:p-0 pt-16">
      <div className="flex-1 ml-0 lg:ml-72 transition-all duration-300">
        <div className="mb-8">
          <NavBarAdmin />

            <main className="p-6">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
                      Gestión de Compras
                    </h1>
                    <p className="text-[#64748B]">
                      Administra y consulta todas las compras realizadas
                    </p>
                  </div>
                  <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white px-6 py-3 rounded-lg shadow-sm transition-all"
                  >
                    <Plus size={20} />
                    Nueva Compra
                  </button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#E2E8F0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#64748B] text-sm mb-1">Total Compras</p>
                        <p className="text-2xl font-bold text-[#1E293B]">
                          S/ {stats.total}
                        </p>
                      </div>
                      <div className="bg-[#F1F5F9] p-3 rounded-lg">
                        <DollarSign className="text-[#94A3B8]" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#E2E8F0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#64748B] text-sm mb-1">N° de Compras</p>
                        <p className="text-2xl font-bold text-[#1E293B]">
                          {stats.count}
                        </p>
                      </div>
                      <div className="bg-[#F1F5F9] p-3 rounded-lg">
                        <ShoppingCart className="text-[#94A3B8]" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#E2E8F0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#64748B] text-sm mb-1">Promedio</p>
                        <p className="text-2xl font-bold text-[#1E293B]">
                          S/ {stats.average}
                        </p>
                      </div>
                      <div className="bg-[#F1F5F9] p-3 rounded-lg">
                        <TrendingUp className="text-[#94A3B8]" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Búsqueda y Filtros */}
                <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#E2E8F0] mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Buscador */}
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Buscar por número, proveedor o usuario..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent text-[#1E293B] placeholder-[#94A3B8]"
                        />
                      </div>
                    </div>

                    {/* Filtro por Proveedor */}
                    <div>
                      <select
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent text-[#1E293B] bg-[#FFFFFF]"
                      >
                        <option value="">Todos los proveedores</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro por Fecha */}
                    <div>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent text-[#1E293B] bg-[#FFFFFF]"
                      />
                    </div>
                  </div>

                  {/* Botones de acción adicionales */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedSupplier("");
                        setDateFilter("");
                      }}
                      className="text-sm text-[#64748B] hover:text-[#1E293B] transition-colors"
                    >
                      Limpiar filtros
                    </button>
                    <div className="flex-1"></div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode("cards")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "cards"
                            ? "bg-[#CBD5E1] text-[#1E293B]"
                            : "bg-[#F1F5F9] text-[#94A3B8] hover:bg-[#E2E8F0]"
                        }`}
                      >
                        <Package size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "table"
                            ? "bg-[#CBD5E1] text-[#1E293B]"
                            : "bg-[#F1F5F9] text-[#94A3B8] hover:bg-[#E2E8F0]"
                        }`}
                      >
                        <FileText size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido principal */}
              {loadingData && (
                <div className="bg-[#F9F7F3] border border-[#E2E8F0] rounded-lg p-4 mb-6 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#94A3B8] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#64748B] text-sm">
                    Cargando datos adicionales...
                  </p>
                </div>
              )}

              {filteredShopping.length === 0 ? (
                <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] p-12 text-center">
                  <ShoppingCart className="mx-auto text-[#CBD5E1] mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-[#1E293B] mb-2">
                    No hay compras registradas
                  </h3>
                  <p className="text-[#64748B] mb-6">
                    Comienza agregando tu primera compra
                  </p>
                  <button
                    onClick={() => openModal()}
                    className="bg-[#1E293B] hover:bg-[#334155] text-white px-6 py-3 rounded-lg transition-all inline-flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Nueva Compra
                  </button>
                </div>
              ) : viewMode === "cards" ? (
                /* Vista de Tarjetas */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredShopping.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] hover:shadow-lg transition-all overflow-hidden group"
                    >
                      {/* Header de la tarjeta */}
                      <div className="bg-gradient-to-r from-[#F1F5F9] to-[#FFFFFF] p-5 border-b border-[#E2E8F0]">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-xs text-[#94A3B8] uppercase tracking-wide mb-1">
                              Compra
                            </p>
                            <p className="text-lg font-bold text-[#1E293B]">
                              {item.shopping_number}
                            </p>
                          </div>
                          <div className="bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#E2E8F0]">
                            <p className="text-xs font-medium text-[#64748B]">
                              #{item.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#64748B]">
                          <Calendar size={14} />
                          <span>{item.date}</span>
                        </div>
                      </div>

                      {/* Contenido de la tarjeta */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#F1F5F9] p-2 rounded-lg">
                            <Building2 className="text-[#94A3B8]" size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#94A3B8] mb-1">Proveedor</p>
                            <p className="text-sm font-medium text-[#1E293B] truncate">
                              {item.supplier?.name ?? "-"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-[#F1F5F9] p-2 rounded-lg">
                            <User className="text-[#94A3B8]" size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#94A3B8] mb-1">Registrado por</p>
                            <p className="text-sm font-medium text-[#1E293B] truncate">
                              {item.user?.name ?? "-"}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#E2E8F0]">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[#64748B] text-sm">Total</span>
                            <span className="text-2xl font-bold text-[#1E293B]">
                              S/ {Number(item.total).toFixed(2)}
                            </span>
                          </div>

                          {/* Botones de acción */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(item)}
                              className="flex-1 flex items-center justify-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] px-4 py-2.5 rounded-lg transition-all text-sm font-medium"
                            >
                              <Edit size={16} />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Vista de Tabla */
                <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                            Número
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                            Proveedor
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                            Usuario
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {filteredShopping.map((item, index) => (
                          <tr
                            key={item.id}
                            className="hover:bg-[#F8FAFC] transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-[#64748B]">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-[#1E293B]">
                                {item.shopping_number}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Building2 size={16} className="text-[#94A3B8]" />
                                <span className="text-sm text-[#1E293B]">
                                  {item.supplier?.name ?? "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <User size={16} className="text-[#94A3B8]" />
                                <span className="text-sm text-[#1E293B]">
                                  {item.user?.name ?? "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-[#94A3B8]" />
                                <span className="text-sm text-[#64748B]">
                                  {item.date}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-semibold text-[#1E293B]">
                                S/ {Number(item.total).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openModal(item)}
                                  className="p-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] rounded-lg transition-all"
                                  title="Editar"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                  title="Eliminar"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </main>

            <ShoppingModal
              show={showModal}
              onClose={closeModal}
              onSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
              products={products}
              users={users}
              suppliers={suppliers}
              categories={categories}
              editingItem={editingItem}
            />
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;