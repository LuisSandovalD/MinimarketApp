import React, { useEffect, useState, useRef } from "react";
import { X, Plus, Trash2, Search, CreditCard, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { createSales, updateSales, getSalesProducts } from "../../api/sales";
import PaymentMethodSelector from "../common/PaymentMethodSelector";

const ModalSales = ({ show, onClose, onSaved, sale, users, customers, paymentMethod, editing }) => {
  if (!show) return null;
  
  const [formData, setFormData] = useState({
    sale_number: "",
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
  
  // Estados para búsqueda de usuarios y clientes
  const [userSearch, setUserSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  
  const userSearchRef = useRef(null);
  const customerSearchRef = useRef(null);

  useEffect(() => {
    if (sale) {
      const normalizedDetails = (sale.details || []).map(detail => ({
        product_id: detail.product_id || "",
        product_name: detail.product_name || "",
        quantity: Number(detail.quantity) || 1,
        unit_price: Number(detail.unit_price) || 0,
        total_price: Number(detail.total_price) || 0,
        code: detail.code || "",
        stock_available: detail.stock_available || 0,
      }));

      setFormData({
        sale_number: sale.sale_number || "",
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
      
      // Establecer nombres para búsqueda
      const user = users?.find(u => u.id === sale.user_id);
      const customer = customers?.find(c => c.id === sale.customer_id);
      if (user) setUserSearch(user.name);
      if (customer) setCustomerSearch(customer.name);
    } else {
      setFormData({
        sale_number: "",
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
      setUserSearch("");
      setCustomerSearch("");
    }
  }, [sale, show, users, customers]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getSalesProducts();
        let list = res?.data || res || [];
        list = list.map((p) => ({
          id: p.id,
          name: p.name || "Sin nombre",
          price: Number(p.price || 0),
          code: p.code || "",
          stock_current: p.stock_current || 0,
        }));
        setProducts(list);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const subtotalCalc = formData.details.reduce(
      (sum, d) => sum + (parseFloat(d.quantity) * parseFloat(d.unit_price) || 0),
      0
    );
    const vat = +(subtotalCalc * 0.18).toFixed(2);
    const total = +(subtotalCalc + vat).toFixed(2);
    setFormData((prev) => ({
      ...prev,
      subtotal: +subtotalCalc.toFixed(2),
      vat,
      total,
    }));
  }, [formData.details]);

  // Cerrar dropdowns al hacer click fuera
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
    newDetails[index] = {
      ...newDetails[index],
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      code: product.code,
      quantity: qty,
      total_price: +(qty * product.price).toFixed(2),
      stock_available: product.stock_current,
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sale_number.trim()) {
      newErrors.sale_number = "El número de venta es requerido";
    }
    if (!formData.user_id) {
      newErrors.user_id = "Debe seleccionar un usuario";
    }
    if (!formData.customer_id) {
      newErrors.customer_id = "Debe seleccionar un cliente";
    }
    if (!formData.payment_method_id) {
      newErrors.payment_method_id = "Debe seleccionar un método de pago";
    }
    if (formData.details.length === 0) {
      newErrors.details = "Debe agregar al menos un producto";
    }
    
    // Validar productos seleccionados
    formData.details.forEach((detail, index) => {
      if (!detail.product_id) {
        newErrors[`product_${index}`] = "Debe seleccionar un producto de la lista";
      }
      if (detail.product_id && detail.quantity > detail.stock_available) {
        newErrors[`stock_${index}`] = `Stock insuficiente. Disponible: ${detail.stock_available}`;
      }
    });
    
    if (formData.is_credit) {
      if (!formData.due_date) {
        newErrors.due_date = "La fecha de vencimiento es requerida para ventas a crédito";
      }
      if (formData.interest_rate < 0) {
        newErrors.interest_rate = "La tasa de interés no puede ser negativa";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Por favor, completa todos los campos requeridos y verifica el stock disponible");
      return;
    }

    // Validación adicional de productos
    const invalidProducts = formData.details.filter(d => !d.product_id);
    if (invalidProducts.length > 0) {
      alert("Por favor, selecciona productos válidos de la lista de búsqueda");
      return;
    }

    // Validación de stock
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
        sale_number: formData.sale_number.trim(),
        customer_id: formData.customer_id,
        payment_method_id: formData.payment_method_id,
        user_id: formData.user_id,
        date: formData.date, // Solo YYYY-MM-DD
        details: cleanDetails,
        notes: formData.notes?.trim() || null,
        is_credit: formData.is_credit,
        interest_rate: formData.is_credit ? (parseFloat(formData.interest_rate) || 0) : null,
        due_date: formData.is_credit && formData.due_date ? formData.due_date : null,
      };

      console.log("Payload enviado:", JSON.stringify(payload, null, 2));
      
      let response;
      if (editing && sale?.id) {
        response = await updateSales(sale.id, payload);
      } else {
        response = await createSales(payload);
      }

      console.log("Respuesta del servidor:", response);

      alert(response?.data?.message || "Venta guardada correctamente");
      onSaved();
      onClose();
      
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Respuesta del error:", error?.response);
      
      let errorMessage = "Error al guardar la venta";
      
      if (error?.response?.data) {
        // Errores de validación de Laravel
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join("\n");
        } 
        // Mensaje de error personalizado
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        // Error con detalles
        else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } 
      // Error de red
      else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error:\n${errorMessage}`);
    }
  };

  const getProductDisplayName = (detail) => {
    if (detail.product_name) return detail.product_name;
    const found = products.find((p) => p.id === detail.product_id);
    return found ? found.name : "";
  };

  const getStockStatus = (detail) => {
    if (!detail.product_id) return null;
    
    const qty = parseFloat(detail.quantity) || 0;
    const stock = detail.stock_available || 0;
    
    if (qty > stock) {
      return { status: 'error', message: `Excede el stock disponible (${stock})` };
    } else if (qty === stock) {
      return { status: 'warning', message: `Usando todo el stock disponible (${stock})` };
    } else if (stock <= 5) {
      return { status: 'warning', message: `Stock bajo (${stock} disponibles)` };
    }
    
    return { status: 'ok', message: `Stock disponible: ${stock}` };
  };

  // Filtrar usuarios
  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  ) || [];

  // Filtrar clientes
  const filteredCustomers = customers?.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  ) || [];

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">
            {editing ? "Editar Venta" : "Nueva Venta"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
            type="button"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSave} id="saleForm">
            {/* Información General */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-700 mb-4">
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Número de Venta <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full border ${errors.sale_number ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all`}
                    value={formData.sale_number}
                    onChange={(e) =>
                      setFormData({ ...formData, sale_number: e.target.value })
                    }
                    placeholder="Ej: V-001"
                  />
                  {errors.sale_number && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.sale_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Fecha <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Notas
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>
            </div>

            {/* Información de Transacción */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-700 mb-4">
                Información de Transacción
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Usuario con búsqueda */}
                <div ref={userSearchRef} className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Usuario/Vendedor <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full border ${errors.user_id ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all`}
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowUserDropdown(true);
                      setFormData({ ...formData, user_id: "" });
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    placeholder="Buscar usuario..."
                  />
                  {errors.user_id && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.user_id}</p>
                  )}
                  {showUserDropdown && filteredUsers.length > 0 && (
                    <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredUsers.map((u) => (
                        <li
                          key={u.id}
                          className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                          onClick={() => {
                            setFormData({ ...formData, user_id: u.id });
                            setUserSearch(u.name);
                            setShowUserDropdown(false);
                          }}
                        >
                          <div className="text-sm text-gray-700">{u.name}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Cliente con búsqueda */}
                <div ref={customerSearchRef} className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Cliente <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full border ${errors.customer_id ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all`}
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                      setFormData({ ...formData, customer_id: "" });
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    placeholder="Buscar cliente..."
                  />
                  {errors.customer_id && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.customer_id}</p>
                  )}
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredCustomers.map((c) => (
                        <li
                          key={c.id}
                          className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                          onClick={() => {
                            setFormData({ ...formData, customer_id: c.id });
                            setCustomerSearch(c.name);
                            setShowCustomerDropdown(false);
                          }}
                        >
                          <div className="text-sm text-gray-700">{c.name}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </div>

            {/* Información de Crédito */}
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="text-gray-600" size={20} />
                  <h3 className="text-base font-medium text-gray-700">
                    Configuración de Crédito
                  </h3>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="is_credit"
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-300"
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
                  <label htmlFor="is_credit" className="ml-2 text-sm font-medium text-gray-700">
                    Esta es una venta a crédito
                  </label>
                </div>

                {formData.is_credit && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-2">
                        <DollarSign size={16} />
                        Tasa de Interés (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`w-full border ${errors.interest_rate ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all`}
                        value={formData.interest_rate}
                        onChange={(e) =>
                          setFormData({ ...formData, interest_rate: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="Ej: 5.00"
                      />
                      {errors.interest_rate && (
                        <p className="text-red-400 text-xs mt-1.5">{errors.interest_rate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-2">
                        <Calendar size={16} />
                        Fecha de Vencimiento <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        className={`w-full border ${errors.due_date ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all`}
                        value={formData.due_date}
                        onChange={(e) =>
                          setFormData({ ...formData, due_date: e.target.value })
                        }
                        min={formData.date}
                      />
                      {errors.due_date && (
                        <p className="text-red-400 text-xs mt-1.5">{errors.due_date}</p>
                      )}
                    </div>
                  </div>
                )}

                {formData.is_credit && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resumen del Crédito</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monto Base:</span>
                        <span className="font-medium text-gray-700">S/. {formData.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interés ({formData.interest_rate}%):</span>
                        <span className="font-medium text-gray-700">S/. {creditInfo.interest.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-700">Total con Interés:</span>
                        <span className="font-semibold text-gray-800">S/. {creditInfo.totalWithInterest.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detalles de Productos */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-700">
                  Productos
                </h3>
                <button
                  type="button"
                  onClick={addDetail}
                  className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm shadow-sm"
                >
                  <Plus size={16} /> Agregar Producto
                </button>
              </div>

              {errors.details && (
                <p className="text-red-400 text-sm mb-3">{errors.details}</p>
              )}

              <div className="space-y-3">
                {formData.details.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No hay productos agregados</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Haz clic en "Agregar Producto" para comenzar
                    </p>
                  </div>
                ) : (
                  formData.details.map((detail, index) => {
                    const stockStatus = getStockStatus(detail);
                    return (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                          <div className="md:col-span-4 relative">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                              Producto
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Buscar por nombre o código..."
                                className={`w-full border ${errors[`product_${index}`] ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all`}
                                value={getProductDisplayName(detail)}
                                onChange={(e) => handleProductInput(index, e.target.value)}
                              />
                              <Search className="absolute right-3 top-3 text-gray-400" size={16} />
                            </div>
                            {errors[`product_${index}`] && (
                              <p className="text-red-400 text-xs mt-1">{errors[`product_${index}`]}</p>
                            )}
                            {search[index]?.length > 0 && (
                              <ul className="absolute bg-white border border-gray-200 w-full max-h-48 overflow-y-auto rounded-lg shadow-lg z-20 mt-1">
                                {search[index].map((p) => (
                                  <li
                                    key={p.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                                    onClick={() => selectProduct(index, p)}
                                  >
                                    <div className="font-medium text-sm text-gray-700">{p.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">
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
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                              Cantidad
                            </label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              max={detail.stock_available || 9999}
                              className={`w-full border ${errors[`stock_${index}`] ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all`}
                              value={detail.quantity}
                              onChange={(e) =>
                                handleDetailChange(index, "quantity", e.target.value)
                              }
                            />
                            {errors[`stock_${index}`] && (
                              <p className="text-red-400 text-xs mt-1">{errors[`stock_${index}`]}</p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                              P. Unitario
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white transition-all"
                              value={detail.unit_price}
                              onChange={(e) =>
                                handleDetailChange(index, "unit_price", e.target.value)
                              }
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                              Total
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-100 font-medium text-gray-700"
                              value={`S/. ${(detail.quantity * detail.unit_price).toFixed(2)}`}
                            />
                          </div>

                          <div className="md:col-span-2 flex items-end">
                            <button
                              type="button"
                              onClick={() => removeDetail(index)}
                              className="w-full bg-gray-700 text-white px-3 py-2.5 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                            >
                              <Trash2 size={16} />
                              <span className="hidden md:inline">Eliminar</span>
                            </button>
                          </div>
                        </div>

                        {/* Indicador de Stock */}
                        {stockStatus && detail.product_id && (
                          <div className={`mt-3 flex items-center gap-2 text-xs ${
                            stockStatus.status === 'error' ? 'text-red-600' : 
                            stockStatus.status === 'warning' ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
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

            {/* Totales */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-end gap-4">
                <div className="md:w-80 space-y-2.5">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-semibold text-gray-700">S/. {formData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">IGV (18%):</span>
                    <span className="font-semibold text-gray-700">S/. {formData.vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-semibold text-gray-800 pt-3 border-t-2 border-gray-300">
                    <span>Total:</span>
                    <span>S/. {formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="saleForm"
              className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all font-medium flex items-center gap-2 shadow-sm"
            >
              {editing ? "Actualizar Venta" : "Guardar Venta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSales;