import React, { useEffect, useState, useCallback } from "react";
import { getUser } from "@/api";

import {
  X,
  Plus,
  Trash2,
  Search,
  Package,
  DollarSign,
  Calendar,
  User,
  Building2,
  FileText,
  Tag,
  ShoppingCart,
  AlertCircle,
  Calculator,
  Save,
  Edit3
} from "lucide-react";


const ShoppingFormModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  users,
  suppliers,
  products,
  categories,
  editingItem,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [user, setUser] = useState(null);
  

  // Inicializar formData cuando se abre el modal
  useEffect(() => {
    if (show && !editingItem && (!formData.details || formData.details.length === 0)) {
      setFormData({
        user_id: "",
        supplier_id: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
        details: [],
        subtotal: 0,
        vat: 0,
        total: 0,
      });
    }
  }, [show, editingItem]);

  // Cargar datos al editar
  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        details: editingItem.details.map((d) => ({
          product_id: d.product?.id || "",
          product_name: d.product?.name || "",
          code: d.product?.code || "",
          category_id: d.product?.category_id || d.product?.category?.id || "",
          quantity: d.quantity,
          unit_price: d.unit_price,
          subtotal: (d.quantity * d.unit_price).toFixed(2),
        })),
        subtotal: editingItem.subtotal || 0,
        vat: editingItem.vat || 0,
        total: editingItem.total || 0,
      });
    }
  }, [editingItem]);

  // Calcular totales
  useEffect(() => {
    if (!formData.details || formData.details.length === 0) {
      setFormData((prev) => ({ ...prev, subtotal: 0, vat: 0, total: 0 }));
      return;
    }

    const subtotal = formData.details.reduce(
      (sum, d) => sum + (parseFloat(d.quantity || 0) * parseFloat(d.unit_price || 0)),
      0
    );

    const vat = +(subtotal * 0.18).toFixed(2);
    const total = +(subtotal + vat).toFixed(2);

    setFormData((prev) => ({ ...prev, subtotal, vat, total }));
  }, [formData.details]);

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id) {
      newErrors.user_id = "Debe seleccionar un usuario";
    }

    if (!formData.supplier_id) {
      newErrors.supplier_id = "Debe seleccionar un proveedor";
    }

    if (!formData.date) {
      newErrors.date = "La fecha es requerida";
    }

    if (!formData.details || formData.details.length === 0) {
      newErrors.details = "Debe agregar al menos un producto";
    } else {
      formData.details.forEach((detail, index) => {
        if (!detail.product_id && !detail.product_name) {
          newErrors[`product_${index}`] = "Seleccione un producto";
        }
        if (!detail.quantity || parseFloat(detail.quantity) <= 0) {
          newErrors[`quantity_${index}`] = "Cantidad inválida";
        }
        if (!detail.unit_price || parseFloat(detail.unit_price) <= 0) {
          newErrors[`price_${index}`] = "Precio inválido";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailChange = useCallback(
    (index, field, value) => {
      const updatedDetails = formData.details.map((d, i) => {
        if (i !== index) return d;
        
        const updated = { ...d, [field]: value };
        
        // Recalcular subtotal si cambia cantidad o precio
        if (field === "quantity" || field === "unit_price") {
          const qty = parseFloat(field === "quantity" ? value : d.quantity) || 0;
          const price = parseFloat(field === "unit_price" ? value : d.unit_price) || 0;
          updated.subtotal = (qty * price).toFixed(2);
        }
        
        return updated;
      });
      
      setFormData({ ...formData, details: updatedDetails });
      
      // Limpiar error del campo modificado
      if (errors[`${field}_${index}`]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[`${field}_${index}`];
          return newErrors;
        });
      }
    },
    [formData, errors]
  );

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const currentUser = await getUser();
      setUser(currentUser);
      setFormData((prev) => ({
        ...prev,
        user_id: currentUser?.id || "",
      }));
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  };

  if (show) {
    fetchUser();
  }
}, [show]);

  const handleProductInput = useCallback(
    (index, value) => {
      const updatedDetails = [...formData.details];
      updatedDetails[index] = {
        ...updatedDetails[index],
        product_name: value,
        product_id: "",
        category_id: "",
      };

      const filtered = value
        ? products.filter(
            (p) =>
              p.name.toLowerCase().includes(value.toLowerCase()) ||
              p.code.toLowerCase().includes(value.toLowerCase())
          )
        : [];

      setSearchResults((prev) => {
        const copy = [...prev];
        copy[index] = filtered;
        return copy;
      });

      setFormData({ ...formData, details: updatedDetails });
    },
    [products, formData]
  );

  const selectProduct = useCallback(
    (index, product) => {
      const updatedDetails = [...formData.details];
      const qty = parseFloat(updatedDetails[index].quantity) || 1;

      updatedDetails[index] = {
        ...updatedDetails[index],
        product_id: product.id,
        product_name: product.name,
        code: product.code,
        unit_price: product.price,
        category_id: product.category_id || "",
        quantity: updatedDetails[index].quantity || 1,
        subtotal: (qty * product.price).toFixed(2),
      };

      setFormData({ ...formData, details: updatedDetails });

      setSearchResults((prev) => {
        const copy = [...prev];
        copy[index] = [];
        return copy;
      });

      // Limpiar error del producto
      if (errors[`product_${index}`]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[`product_${index}`];
          return newErrors;
        });
      }
    },
    [formData, errors]
  );

  const addDetail = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      details: [
        ...(prev.details || []),
        {
          product_id: "",
          product_name: "",
          code: "",
          category_id: "",
          quantity: 1,
          unit_price: "",
          subtotal: 0,
        },
      ],
    }));
  }, []);

  const removeDetail = useCallback(
    (index) => {
      const newDetails = formData.details.filter((_, i) => i !== index);
      setFormData({ ...formData, details: newDetails });
      
      // Limpiar errores de este índice
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`product_${index}`];
        delete newErrors[`quantity_${index}`];
        delete newErrors[`price_${index}`];
        return newErrors;
      });
    },
    [formData]
  );

  const duplicateDetail = useCallback(
    (index) => {
      const detail = formData.details[index];
      const newDetail = { ...detail, quantity: 1, subtotal: detail.unit_price };
      setFormData((prev) => ({
        ...prev,
        details: [...prev.details, newDetail],
      }));
    },
    [formData]
  );

  const clearAllDetails = useCallback(() => {
    if (confirm("¿Está seguro de limpiar todos los productos?")) {
      setFormData((prev) => ({ ...prev, details: [] }));
      setErrors({});
    }
  }, []);

  const getProductDisplayName = (detail) =>
    detail.product_name ||
    products.find((p) => p.id === detail.product_id)?.name ||
    "";

  const handleClose = () => {
    setSearchResults([]);
    setErrors({});
    setTouched({});
    onClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
      handleClose();
    } else {
      alert("Por favor, corrija los errores antes de guardar");
    }
  };

  // Cálculos para el resumen
  const totalItems = (formData.details || []).reduce(
    (sum, d) => sum + (parseFloat(d.quantity) || 0),
    0
  );

  const averagePrice = formData.details && formData.details.length > 0
    ? (formData.subtotal / formData.details.length).toFixed(2)
    : "0.00";

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header del Modal */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {editingItem ? "Editar Compra" : "Nueva Compra"}
              </h2>
              <p className="text-slate-300 text-sm">
                {editingItem 
                  ? "Modifique los datos de la compra existente" 
                  : "Complete los datos para registrar una nueva compra"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Información General */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="text-slate-400" size={20} />
                <h3 className="text-lg font-semibold text-slate-800">
                  Información General
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Fecha *
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="date"
                      disabled
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent text-slate-800 w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none ${
                        errors.date ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                      value={formData.date || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        if (errors.date) {
                          setErrors(prev => ({ ...prev, date: undefined }));
                        }
                      }}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.date}
                    </p>
                  )}
                </div>

                {/* Usuario */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Usuario *
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <select
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent text-slate-800 appearance-none border-gray-200`}
                        value={formData.user_id || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, user_id: e.target.value });
                          if (errors.user_id) {
                            setErrors(prev => ({ ...prev, user_id: undefined }));
                          }
                        }}
                      >
                        <option value="">Seleccione usuario</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>

                  </div>
                  {errors.user_id && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.user_id}
                    </p>
                  )}
                </div>

                {/* Proveedor */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Proveedor *
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <select
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent text-slate-800 appearance-none ${
                        errors.supplier_id ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                      value={formData.supplier_id || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, supplier_id: e.target.value });
                        if (errors.supplier_id) {
                          setErrors(prev => ({ ...prev, supplier_id: undefined }));
                        }
                      }}
                    >
                      <option value="">Seleccione proveedor</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.supplier_id && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.supplier_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Notas */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Notas / Observaciones
                </label>
                <textarea
                  rows="2"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent text-slate-800 placeholder-slate-400 resize-none"
                  placeholder="Ingrese observaciones adicionales..."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            {/* Productos */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <Package className="text-slate-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800">
                    Productos ({formData.details?.length || 0})
                  </h3>
                </div>
                <div className="flex gap-2">
                  {formData.details && formData.details.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllDetails}
                      className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-all text-sm"
                    >
                      <Trash2 size={16} />
                      Limpiar todo
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={addDetail}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all text-sm"
                  >
                    <Plus size={16} />
                    Agregar Producto
                  </button>
                </div>
              </div>

              {errors.details && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-700">
                  <AlertCircle size={18} />
                  <span className="text-sm">{errors.details}</span>
                </div>
              )}

              {!formData.details || formData.details.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <Package className="mx-auto text-slate-300 mb-3" size={48} />
                  <p className="text-slate-600 mb-4">No hay productos agregados</p>
                  <button
                    type="button"
                    onClick={addDetail}
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-all"
                  >
                    <Plus size={18} />
                    Agregar primer producto
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.details.map((detail, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 border border-gray-200 rounded-lg p-4 hover:border-slate-300 transition-all"
                    >
                      <div className="grid grid-cols-12 gap-3 items-start">
                        {/* Número de ítem */}
                        <div className="col-span-12 md:col-span-1 flex items-center justify-center">
                          <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                        </div>

                        {/* Producto */}
                        <div className="col-span-12 md:col-span-4 relative">
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Producto *
                          </label>
                          <div className="relative">
                            <Search
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                              size={16}
                            />
                            <input
                              type="text"
                              placeholder="Buscar por nombre o código..."
                              className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm text-slate-800 placeholder-slate-400 ${
                                errors[`product_${index}`] ? "border-red-400 bg-red-50" : "border-gray-200"
                              }`}
                              value={getProductDisplayName(detail)}
                              onChange={(e) => handleProductInput(index, e.target.value)}
                            />
                          </div>
                          {errors[`product_${index}`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`product_${index}`]}</p>
                          )}
                          {searchResults[index]?.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 max-h-48 overflow-y-auto rounded-lg shadow-lg z-30">
                              {searchResults[index].map((p) => (
                                <li
                                  key={p.id}
                                  className="p-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                                  onClick={() => selectProduct(index, p)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="text-sm font-medium text-slate-800">{p.name}</p>
                                      <p className="text-xs text-slate-600">Código: {p.code}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800">
                                      S/ {Number(p.price).toFixed(2)}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Categoría */}
                        <div className="col-span-12 md:col-span-2">
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Categoría
                          </label>
                          <div className="relative">
                            <Tag
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                              size={14}
                            />
                            <select
                              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm text-slate-800 appearance-none"
                              value={detail.category_id || ""}
                              onChange={(e) => handleDetailChange(index, "category_id", e.target.value)}
                            >
                              <option value="">Sin categoría</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Cantidad */}
                        <div className="col-span-6 md:col-span-2">
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Cantidad *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm text-slate-800 ${
                              errors[`quantity_${index}`] ? "border-red-400 bg-red-50" : "border-gray-200"
                            }`}
                            value={detail.quantity || ""}
                            onChange={(e) => handleDetailChange(index, "quantity", e.target.value)}
                          />
                          {errors[`quantity_${index}`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`quantity_${index}`]}</p>
                          )}
                        </div>

                        {/* Precio Unitario */}
                        <div className="col-span-6 md:col-span-2">
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Precio Unit. *
                          </label>
                          <div className="relative">
                            <DollarSign
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400"
                              size={14}
                            />
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm text-slate-800 ${
                                errors[`price_${index}`] ? "border-red-400 bg-red-50" : "border-gray-200"
                              }`}
                              value={detail.unit_price || ""}
                              onChange={(e) => handleDetailChange(index, "unit_price", e.target.value)}
                            />
                          </div>
                          {errors[`price_${index}`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`price_${index}`]}</p>
                          )}
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-6 md:col-span-2">
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Subtotal
                          </label>
                          <div className="bg-slate-100 px-3 py-2 rounded-lg border border-gray-200">
                            <p className="text-sm font-semibold text-slate-800">
                              S/ {Number(detail.subtotal || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="col-span-6 md:col-span-1 flex flex-col gap-2">
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Acciones
                          </label>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => duplicateDetail(index)}
                              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                              title="Duplicar"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDetail(index)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen y Totales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Resumen Estadístico */}
              <div className="lg:col-span-2 bg-[#FFFFFF] rounded-lg p-6 border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="text-[#94A3B8]" size={20} />
                  <h3 className="text-lg font-semibold text-[#1E293B]">
                    Resumen Estadístico
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="text-[#94A3B8]" size={18} />
                      <p className="text-xs text-[#64748B]">Productos</p>
                    </div>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      {formData.details.length}
                    </p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="text-[#94A3B8]" size={18} />
                      <p className="text-xs text-[#64748B]">Total Items</p>
                    </div>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      {totalItems.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="text-[#94A3B8]" size={18} />
                      <p className="text-xs text-[#64748B]">Precio Prom.</p>
                    </div>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      S/ {averagePrice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Totales */}
              <div className="bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-lg p-6 text-white border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="text-[#CBD5E1]" size={20} />
                  <h3 className="text-lg font-semibold">Totales</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-[#CBD5E1] text-sm">Subtotal:</span>
                    <span className="text-lg font-semibold">
                      S/ {Number(formData.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-[#CBD5E1] text-sm">IGV (18%):</span>
                    <span className="text-lg font-semibold">
                      S/ {Number(formData.vat || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white font-semibold">TOTAL:</span>
                    <span className="text-3xl font-bold">
                      S/ {Number(formData.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer con Acciones */}
        <div className="bg-[#F8FAFC] px-6 py-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <AlertCircle size={16} />
            <span>Los campos marcados con * son obligatorios</span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#1E293B] px-6 py-3 rounded-lg border border-[#E2E8F0] transition-all font-medium"
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white px-6 py-3 rounded-lg shadow-sm transition-all font-medium"
            >
              {editingItem ? (
                <>
                  <Edit3 size={18} />
                  Actualizar Compra
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Compra
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingFormModal;
