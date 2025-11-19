import React, { useEffect, useState, useRef } from "react";
import { X, Plus, Trash2, Search, CreditCard, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { createSales, updateSales, getSalesProducts } from "@/api";
import PaymentMethodSelector from "../features/sales/componnets/PaymentMethodSelector";
import { getUser } from "@/api";
import DateField from "../../components/features/sales/componnets/DateField"; // Asegúrate que este componente esté corregido

const SalesListFormModal = ({ show, onClose, onSaved, sale, users, customers, paymentMethod, editing }) => {
  if (!show) return null;
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    user_id: "",
    customer_id: "",
    payment_method_id: "",
    notes: "",
    details: [],
    subtotal: 0,
    vat: 0,
    total: 0,
    is_credit: false,
    interest_rate: 0,
    due_date: "",
  });

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState([]);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUnregisteredCustomer, setIsUnregisteredCustomer] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const userSearchRef = useRef(null);
  const customerSearchRef = useRef(null);

  // --- LÓGICA INTERNA (Sin cambios, toda esta parte estaba correcta) ---

  // Cargar productos y usuario
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [res, data] = await Promise.all([getSalesProducts(), getUser()]);
        let list = res?.data || res || [];
        list = list.map((p) => ({
          id: p.id,
          name: p.name || "Sin nombre",
          price: Number(p.price || 0),
          code: p.code || "",
          stock_current: p.stock_current || 0,
        }));
        setProducts(list);
        setUser(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Establecer usuario automáticamente
  useEffect(() => {
    if (user && !sale && !formData.user_id) {
      setFormData((prev) => ({ ...prev, user_id: user.id }));
    }
  }, [user, sale, formData.user_id]);

  // Seleccionar "Cliente sin registrar" por defecto
  useEffect(() => {
    if (!sale && customers.length > 0 && !formData.customer_id) {
      const defaultCustomer = customers.find(
        (c) => c.name.toLowerCase() === "cliente sin registrar"
      );
      if (defaultCustomer) {
        setFormData((prev) => ({ ...prev, customer_id: defaultCustomer.id }));
        setCustomerSearch(defaultCustomer.name);
        setIsUnregisteredCustomer(true);
      }
    }
  }, [customers, sale, formData.customer_id]);

  // Cargar datos de venta en modo edición
  useEffect(() => {
    if (sale && products.length > 0) {
      const normalizedDetails = (sale.details || []).map(detail => {
        const currentProduct = products.find(p => p.id === detail.product_id);
        const stockAvailable = currentProduct 
          ? currentProduct.stock_current + Number(detail.quantity || 0)
          : 0;
        return {
          product_id: detail.product_id || "",
          product_name: detail.product_name || "",
          quantity: Number(detail.quantity) || 1,
          unit_price: Number(detail.unit_price) || 0,
          total_price: Number(detail.total_price) || 0,
          code: detail.code || "",
          stock_available: stockAvailable,
        };
      });

      setFormData({
        date: sale.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        user_id: sale.user_id || "",
        customer_id: sale.customer_id || "",
        payment_method_id: sale.payment_method_id || "",
        notes: sale.notes || "",
        details: normalizedDetails,
        subtotal: Number(sale.subtotal) || 0,
        vat: Number(sale.vat) || 0,
        total: Number(sale.total) || 0,
        is_credit: sale.is_credit || false,
        interest_rate: sale.interest_rate || 0,
        due_date: sale.due_date?.slice(0, 10) || "",
      });
      
      const foundUser = users?.find(u => u.id === sale.user_id);
      const customer = customers?.find(c => c.id === sale.customer_id);
      
      if (foundUser) setUserSearch(foundUser.name);
      if (customer) {
        setCustomerSearch(customer.name);
        setIsUnregisteredCustomer(customer.name.toLowerCase() === "cliente sin registrar");
      }
    }
  }, [sale, show, users, customers, products]);

  // Calcular totales (IGV y redondeo)
  useEffect(() => {
    const subtotalCalc = formData.details.reduce(
      (sum, d) => sum + (parseFloat(d.quantity) * parseFloat(d.unit_price) || 0),
      0
    );
    const totalWithIGV = subtotalCalc * 1.18;
    const total = Math.round(totalWithIGV);
    const vat = total - subtotalCalc;
    setFormData((prev) => ({
      ...prev,
      subtotal: +subtotalCalc.toFixed(2),
      vat: +vat.toFixed(2),
      total,
    }));
  }, [formData.details]);

  // Cerrar dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userSearchRef.current && !userSearchRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (customerSearchRef.current && !customerSearchRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calcular crédito
  const calculateCredit = () => {
    if (!formData.is_credit) return { interest: 0, totalWithInterest: formData.total };
    const interest = (formData.total * (formData.interest_rate || 0)) / 100;
    const totalWithInterest = formData.total + interest;
    return {
      interest: +interest.toFixed(2),
      totalWithInterest: +totalWithInterest.toFixed(2)
    };
  };
  const creditInfo = calculateCredit();

  // Handlers de detalles (productos)
  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    if (["quantity", "unit_price"].includes(field)) {
      const qty = parseFloat(newDetails[index].quantity) || 0;
      const price = parseFloat(newDetails[index].unit_price) || 0;
      newDetails[index].total_price = +(qty * price).toFixed(2);
    }
    setFormData({ ...formData, details: newDetails });
  };

  const handleProductInput = (index, value) => {
    const newDetails = [...formData.details];
    newDetails[index].product_name = value;
    newDetails[index].product_id = "";
    if (value.trim() !== "") {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          p.code.toLowerCase().includes(value.toLowerCase())
      );
      setSearch((prev) => {
        const updated = [...prev];
        updated[index] = filtered;
        return updated;
      });
    } else {
      setSearch((prev) => {
        const updated = [...prev];
        updated[index] = [];
        return updated;
      });
    }
    setFormData({ ...formData, details: newDetails });
  };

  const selectProduct = (index, product) => {
    const newDetails = [...formData.details];
    const qty = parseFloat(newDetails[index].quantity) || 1;
    const stockAvailable = editing && newDetails[index].product_id === product.id
      ? newDetails[index].stock_available
      : product.stock_current;
    newDetails[index] = {
      ...newDetails[index],
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      code: product.code,
      quantity: qty,
      total_price: +(qty * product.price).toFixed(2),
      stock_available: stockAvailable,
    };
    setFormData({ ...formData, details: newDetails });
    setSearch((prev) => {
      const updated = [...prev];
      updated[index] = [];
      return updated;
    });
  };

  const addDetail = () => {
    setFormData({
      ...formData,
      details: [
        ...formData.details,
        { product_id: "", product_name: "", quantity: 1, unit_price: 0, total_price: 0, code: "", stock_available: 0 },
      ],
    });
  };

  const removeDetail = (index) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  // Validación
  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_id) newErrors.user_id = "Debe seleccionar un usuario";
    if (!formData.customer_id) newErrors.customer_id = "Debe seleccionar un cliente";
    if (!formData.payment_method_id) newErrors.payment_method_id = "Debe seleccionar un método de pago";
    if (formData.details.length === 0) newErrors.details = "Debe agregar al menos un producto";

    formData.details.forEach((detail, index) => {
      if (!detail.product_id) newErrors[`product_${index}`] = "Debe seleccionar un producto de la lista";
      if (detail.product_id && detail.quantity > detail.stock_available) {
        newErrors[`stock_${index}`] = `Stock insuficiente. Disponible: ${detail.stock_available}`;
      }
    });

    if (formData.is_credit) {
      if (!formData.due_date) { // <-- Esta validación ahora funcionará
        newErrors.due_date = "La fecha de vencimiento es requerida para ventas a crédito";
      }
      if (formData.interest_rate < 0) newErrors.interest_rate = "La tasa de interés no puede ser negativa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar Venta
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Por favor, completa todos los campos requeridos y verifica el stock disponible");
      return;
    }
    const invalidProducts = formData.details.filter(d => !d.product_id);
    if (invalidProducts.length > 0) {
      alert("Por favor, selecciona productos válidos de la lista de búsqueda");
      return;
    }
    const stockIssues = formData.details.filter(d => d.quantity > d.stock_available);
    if (stockIssues.length > 0) {
      const messages = stockIssues.map(d => 
        `${d.product_name}: Solicitado ${d.quantity}, Disponible ${d.stock_available}`
      );
      alert(`Stock insuficiente:\n${messages.join('\n')}`);
      return;
    }
    try {
      const cleanDetails = formData.details.map(detail => ({
        product_id: detail.product_id,
        quantity: parseFloat(detail.quantity) || 1
      }));
      const payload = {
        customer_id: formData.customer_id,
        payment_method_id: formData.payment_method_id,
        user_id: formData.user_id,
        date: formData.date,
        details: cleanDetails,
        notes: formData.notes?.trim() || null,
        is_credit: formData.is_credit,
        interest_rate: formData.is_credit ? (parseFloat(formData.interest_rate) || 0) : null,
        due_date: formData.is_credit && formData.due_date ? formData.due_date : null,
      };
      
      let response;
      if (editing && sale?.id) {
        response = await updateSales(sale.id, payload);
      } else {
        response = await createSales(payload);
      }
      alert(response?.data?.message || "Venta guardada correctamente");
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error al guardar la venta:", error.response || error);
      let errorMessage = "Error al guardar la venta";
      if (error?.response?.data) {
        if (error.response.data.errors) errorMessage = Object.values(error.response.data.errors).flat().join("\n");
        else if (error.response.data.message) errorMessage = error.response.data.message;
        else if (error.response.data.error) errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(`Error:\n${errorMessage}`);
    }
  };

  // Helpers de UI
  const getProductDisplayName = (detail) => {
    if (detail.product_name) return detail.product_name;
    const found = products.find((p) => p.id === detail.product_id);
    return found ? found.name : "";
  };
  const getStockStatus = (detail) => {
    if (!detail.product_id) return null;
    const qty = parseFloat(detail.quantity) || 0;
    const stock = detail.stock_available || 0;
    if (qty > stock) return { status: 'error', message: `Excede el stock disponible (${stock})` };
    if (qty === stock) return { status: 'warning', message: `Usando todo el stock disponible (${stock})` };
    if (stock <= 5) return { status: 'warning', message: `Stock bajo (${stock} disponibles)` };
    return { status: 'ok', message: `Stock disponible: ${stock}` };
  };
  const handleCustomerSelect = (customer) => {
    const isUnregistered = customer.name.toLowerCase() === "cliente sin registrar";
    setFormData({
      ...formData,
      customer_id: customer.id,
      is_credit: isUnregistered ? false : formData.is_credit,
      interest_rate: isUnregistered ? 0 : formData.interest_rate,
      due_date: isUnregistered ? "" : formData.due_date,
    });
    setCustomerSearch(customer.name);
    setIsUnregisteredCustomer(isUnregistered);
    setShowCustomerDropdown(false);
  };

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  ) || [];
  const filteredCustomers = customers?.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  ) || [];
  
  // --- FIN LÓGICA INTERNA ---

  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800">
            {editing ? "Editar Venta" : "Nueva Venta"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-white p-2 rounded-lg transition-all"
            type="button"
          >
            <X size={22} />
          </button>
        </div>
            
        {/* --- CORRECCIÓN ESTRUCTURAL ---
          El <form> envuelve el contenido (con scroll) Y el footer (fijo) 
        */}
        <form onSubmit={handleSave} id="saleForm" className="flex-1 flex flex-col overflow-hidden">
          
          {/* Contenido Principal con Scroll */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Información General */}
            <h3 className="text-base font-medium text-slate-700 mb-4">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Fecha <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-700 cursor-not-allowed focus:outline-none"
                  value={formData.date}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Notas</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white transition-all"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>

            {/* Información de Transacción */}
            <div className="mt-6">
              <h3 className="text-base font-medium text-slate-700 mb-4">Información de Transacción</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Vendedor</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-700 cursor-not-allowed focus:outline-none"
                    value={users?.find((u) => u.id === formData.user_id)?.name || user?.name || ""}
                    disabled
                  />
                </div>
                <div ref={customerSearchRef} className="relative">
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    Cliente <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full border ${errors.customer_id ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white transition-all`}
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    placeholder="Buscar cliente..."
                  />
                  {errors.customer_id && <p className="text-red-400 text-xs mt-1.5">{errors.customer_id}</p>}
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <ul className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredCustomers.map((c) => (
                        <li key={c.id}
                          className="px-3 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                          onClick={() => handleCustomerSelect(c)}
                        >
                          <div className="text-sm text-slate-700">{c.name}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors} // Pasar errores al selector
                />
              </div>
            </div>

            {/* Detalles de Productos */}
            <div className="mt-6 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-slate-700">Productos</h3>
                <button
                  type="button"
                  onClick={addDetail}
                  className="flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-lg hover:bg-cyan-100 transition-all text-sm shadow-sm"
                >
                  <Plus size={16} /> Agregar Producto
                </button>
              </div>
              {errors.details && <p className="text-red-400 text-sm mb-3">{errors.details}</p>}
              <div className="space-y-3">
                {formData.details.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No hay productos agregados</p>
                    <p className="text-sm text-slate-400 mt-1">Haz clic en "Agregar Producto" para comenzar</p>
                  </div>
                ) : (
                  formData.details.map((detail, index) => {
                    const stockStatus = getStockStatus(detail);
                    return (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                          <div className="md:col-span-4 relative">
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Producto</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Buscar por nombre o código..."
                                className={`w-full border ${errors[`product_${index}`] ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white transition-all`}
                                value={getProductDisplayName(detail)}
                                onChange={(e) => handleProductInput(index, e.target.value)}
                              />
                              <Search className="absolute right-3 top-3 text-slate-400" size={16} />
                            </div>
                            {errors[`product_${index}`] && <p className="text-red-400 text-xs mt-1">{errors[`product_${index}`]}</p>}
                            {search[index]?.length > 0 && (
                              <ul className="absolute bg-white border border-slate-200 w-full max-h-48 overflow-y-auto rounded-lg shadow-lg z-20 mt-1">
                                {search[index].map((p) => (
                                  <li key={p.id}
                                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                                    onClick={() => selectProduct(index, p)}
                                  >
                                    <div className="font-medium text-sm text-slate-700">{p.name}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                      Código: {p.code} | Precio: S/.{(p.price || 0).toFixed(2)} | 
                                      <span className={`font-semibold ${p.stock_current <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                                        {' '}Stock: {p.stock_current}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Cantidad</label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              max={detail.stock_available || 9999}
                              className={`w-full border ${errors[`stock_${index}`] ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white transition-all`}
                              value={detail.quantity}
                              onChange={(e) => handleDetailChange(index, "quantity", e.target.value)}
                            />
                            {errors[`stock_${index}`] && <p className="text-red-400 text-xs mt-1">{errors[`stock_${index}`]}</p>}
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">P. Unitario</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white transition-all"
                              value={detail.unit_price}
                              onChange={(e) => handleDetailChange(index, "unit_price", e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Total</label>
                            <input
                              type="text"
                              readOnly
                              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-100 font-medium text-slate-700"
                              value={`S/. ${(detail.quantity * detail.unit_price).toFixed(2)}`}
                            />
                          </div>
                          <div className="md:col-span-2 flex items-end h-full">
                            <button
                              type="button"
                              onClick={() => removeDetail(index)}
                              className="w-full bg-red-500 text-white px-3 py-2.5 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                            >
                              <Trash2 size={16} />
                              <span className="hidden md:inline">Eliminar</span>
                            </button>
                          </div>
                        </div>
                        {stockStatus && detail.product_id && (
                          <div className={`mt-3 flex items-center gap-2 text-xs ${stockStatus.status === 'error' ? 'text-red-600' : stockStatus.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                            <AlertCircle size={14} />
                            <span className="font-medium">{stockStatus.message}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Configuración de Crédito */}
            {!isUnregisteredCustomer && (
              <div className="mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="text-blue-600" size={20} />
                    <h3 className="text-base font-medium text-slate-700">Configuración de Crédito</h3>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="is_credit"
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-300"
                      checked={formData.is_credit}
                      onChange={(e) => {
                        const isCredit = e.target.checked;
                        setFormData({ 
                          ...formData, 
                          is_credit: isCredit,
                          interest_rate: isCredit ? formData.interest_rate : 0,
                          due_date: isCredit ? formData.due_date : ""
                        });
                      }}
                    />
                    <label htmlFor="is_credit" className="ml-2 text-sm font-medium text-slate-700">
                      Esta es una venta a crédito
                    </label>
                  </div>
                  {formData.is_credit && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5 flex items-center gap-2">
                          <DollarSign size={16} /> Tasa de Interés (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className={`w-full border ${errors.interest_rate ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white transition-all`}
                          value={formData.interest_rate}
                          onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) || 0 })}
                          placeholder="Ej: 5.00"
                        />
                        {errors.interest_rate && <p className="text-red-400 text-xs mt-1.5">{errors.interest_rate}</p>}
                      </div>
                      
                      {/* Aquí se renderiza tu componente corregido */}
                      <DateField 
                        formData={formData} 
                        setFormData={setFormData} 
                        errors={errors}
                      />
                      
                    </div>
                  )}
                  {formData.is_credit && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Resumen del Crédito</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Monto Base:</span>
                          <span className="font-medium text-slate-700">S/. {formData.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Interés ({formData.interest_rate}%):</span>
                          <span className="font-medium text-slate-700">S/. {creditInfo.interest.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span className="font-semibold text-slate-700">Total con Interés:</span>
                          <span className="font-semibold text-blue-600">S/. {creditInfo.totalWithInterest.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Aviso de Cliente no Registrado (lógica movida aquí) */}
            {isUnregisteredCustomer && (
              <div className="mb-6">
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="text-cyan-600 mt-0.5" size={18} />
                  <p className="text-sm text-cyan-700">
                    Las ventas a "Cliente sin registrar" no pueden ser a crédito.
                  </p>
                </div>
              </div>
            )}

          </div> {/* <-- Fin del div con scroll */}

          {/* --- FOOTER CON BOTONES Y TOTALES (AGREGADO) --- */}
          <div className="border-t border-slate-200 p-6 bg-slate-50 rounded-b-xl">
            <div className="flex flex-wrap justify-between items-center gap-4">
              
              {/* Resumen de Totales */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-slate-500">Subtotal: </span>
                  <span className="font-semibold text-slate-700">
                    S/. {formData.subtotal.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">IGV (18%): </span>
                  <span className="font-semibold text-slate-700">
                    S/. {formData.vat.toFixed(2)}
                  </span>
                </div>
                <div className="text-base">
                  <span className="text-slate-600">Total a Pagar: </span>
                  <span className="font-bold text-blue-600 text-lg">
                    S/. {formData.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md"
                >
                  {editing ? "Actualizar Venta" : "Guardar Venta"}
                </button>
              </div>
            </div>

            {/* Muestra el total a crédito si aplica */}
            {formData.is_credit && !isUnregisteredCustomer && (
              <div className="mt-4 text-right">
                <span className="text-slate-600 font-medium">Total (con interés): </span>
                <span className="font-bold text-blue-600 text-lg">
                  S/. {creditInfo.totalWithInterest.toFixed(2)}
                </span>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default SalesListFormModal;