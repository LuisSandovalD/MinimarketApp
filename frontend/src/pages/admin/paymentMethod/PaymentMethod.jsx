import React, { useState } from "react";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import PaymentMethodFormModal from "../../../components/modalsForms/PaymentFormModal";
import ConfirmDialog from "../../../components/common/modals/ConfirmDialog";

// Hooks
import { usePaymentMethods } from "../../../components/features/payment/hooks/usePaymentMethods";
import { usePaymentFilters } from "../../../components/features/payment/hooks/usePaymentFilters";
import { usePaymentForm } from "../../../components/features/payment/hooks/usePaymentForm";
import { useToast } from "../../../components/features/payment/hooks/useToast";

// Utils
import { calculatePaymentStats } from "../../../components/features/payment/utils/paymentStats";

// Components
import { StatCard } from "../../../components/features/payment/components/StatCard";
import { PaymentHeader } from "../../../components/features/payment/components/PaymentHeader";
import { PaymentFilters } from "../../../components/features/payment/components/PaymentFilters";
import { PaymentGrid } from "../../../components/features/payment/components/PaymentGrid";
import { EmptyState } from "../../../components/features/payment/components/EmptyState";
import { Toast } from "../../../components/features/payment/components/Toast";

export default function PaymentMethodCrud() {
  // Data management
  const { paymentMethods, loading, createMethod, updateMethod, deleteMethod } =
    usePaymentMethods();

  // Filters
  const { search, setSearch, filterStatus, setFilterStatus, filtered } =
    usePaymentFilters(paymentMethods);

  // Form management
  const {
    form,
    editingId,
    showModal,
    handleChange,
    openModalForNew,
    openModalForEdit,
    closeModal,
    validateForm,
  } = usePaymentForm();

  // Toast notifications
  const { toast, showToast } = useToast();

  // Confirm dialog
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    id: null,
    name: "",
  });

  // Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.valid) {
      showToast(validation.error, "error");
      return;
    }

    const result = editingId
      ? await updateMethod(editingId, form)
      : await createMethod(form);

    if (result.success) {
      const message = editingId
        ? "Método de pago actualizado correctamente"
        : "Método de pago creado correctamente";
      showToast(message, "success");
      closeModal();
    } else {
      showToast(result.error, "error");
    }
  };

  const confirmDelete = (method) => {
    setConfirmModal({
      show: true,
      id: method.id,
      name: method.name,
    });
  };

  const handleDelete = async () => {
    const result = await deleteMethod(confirmModal.id);

    if (result.success) {
      showToast("Método de pago eliminado correctamente", "success");
    } else {
      showToast(result.error, "error");
    }

    setConfirmModal({ show: false, id: null, name: "" });
  };

  // Stats
  const stats = calculatePaymentStats(paymentMethods);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:pt-0 pt-16 relative">
      <NavBarAdmin />

      <Toast toast={toast} />

      <PaymentMethodFormModal
        open={showModal}
        onClose={closeModal}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editingId={editingId}
      />

      <ConfirmDialog
        open={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, id: null, name: "" })}
        onConfirm={handleDelete}
        title="Eliminar Método de Pago"
        message={`¿Estás seguro de eliminar el método de pago "${confirmModal.name}"? Esta acción no se puede deshacer.`}
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-72 transition-all duration-300">
        <div className="mb-8">
          <PaymentHeader onNewMethod={openModalForNew} />

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={CreditCard}
              label="Total"
              value={stats.total}
              color="blue"
            />
            <StatCard
              icon={CheckCircle}
              label="Activos"
              value={stats.active}
              color="green"
            />
            <StatCard
              icon={XCircle}
              label="Inactivos"
              value={stats.inactive}
              color="orange"
            />
          </div>
        </div>

        <PaymentFilters
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {filtered.length > 0 ? (
          <PaymentGrid
            methods={filtered}
            onEdit={openModalForEdit}
            onDelete={confirmDelete}
          />
        ) : (
          <EmptyState
            search={search}
            filterStatus={filterStatus}
            onNewMethod={openModalForNew}
          />
        )}
      </div>
    </div>
  );
}