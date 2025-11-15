import { useState, useCallback } from "react";

export const usePaymentForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = useCallback(() => {
    setForm({ name: "", description: "", active: true });
    setEditingId(null);
  }, []);

  const openModalForNew = () => {
    resetForm();
    setShowModal(true);
  };

  const openModalForEdit = (method) => {
    setForm({
      name: method.name,
      description: method.description || "",
      active: Boolean(method.active),
    });
    setEditingId(method.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return { valid: false, error: "El nombre es requerido" };
    }
    return { valid: true };
  };

  return {
    form,
    editingId,
    showModal,
    handleChange,
    resetForm,
    openModalForNew,
    openModalForEdit,
    closeModal,
    validateForm,
  };
};