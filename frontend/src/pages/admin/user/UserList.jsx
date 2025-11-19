import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, XCircle } from "lucide-react";

// Hooks
import useUsers from "@/components/features/users/hooks/useUsers";

// Components
import NavBar from "@/components/navbars/NavBarAdmin";
import Loading from "@/components/common/loaders/AppLoading";
import ConfirmDialog from "@/components/common/modals/ConfirmDialog";
import Pagination from "@/components/common/Pagination";
import ModalUser from "@/components/modalsForms/UserFormModal";

// Feature Components
import UserHeader from "@/components/features/users/componnets/UserHeader";
import UserStats from "@/components/features/users/componnets/UserStats";
import UserFilters from "@/components/features/users/componnets/UserFilters";
import UserTable from "@/components/features/users/componnets/UserTable";
import UserToast from "@/components/features/users/componnets/UserToast";

export default function UserList() {
  const {
    filtered,
    currentUsers,
    loading,
    error,
    toast,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    showFilters,
    setShowFilters,
    pagination,
    goToPage,
    changeItemsPerPage,
    getPageNumbers,
    uniqueRoles,
    activeFiltersCount,
    clearFilters,
    stats,
    indexOfFirst,
    loadUsers,
    handleDeleteUser,
    showToast,
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, name: "" });

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserSaved = () => {
    loadUsers();
    handleCloseModal();
    showToast(
      selectedUser ? "Usuario actualizado correctamente" : "Usuario creado correctamente",
      "success"
    );
  };

  const confirmDelete = (user) => {
    setConfirmModal({
      show: true,
      id: user.id,
      name: user.name,
    });
  };

  const onConfirmDelete = async () => {
    await handleDeleteUser(confirmModal.id);
    setConfirmModal({ show: false, id: null, name: "" });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 lg:pt-0 pt-16">
      <NavBar />

      <UserToast toast={toast} />

      <ConfirmDialog
        open={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, id: null, name: "" })}
        onConfirm={onConfirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de eliminar al usuario "${confirmModal.name}"? Esta acción no se puede deshacer.`}
      />

      <div className="flex-1 lg:ml-72 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <UserHeader onNewUser={() => handleOpenModal()} users={filtered} />

          <UserStats stats={stats} />

          <UserFilters
            search={search}
            setSearch={setSearch}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            toggleSortOrder={toggleSortOrder}
            uniqueRoles={uniqueRoles}
            activeFiltersCount={activeFiltersCount}
            clearFilters={clearFilters}
          />
        </div>

        {/* Contenido principal */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <XCircle className="mx-auto text-red-500 mb-3" size={48} />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-blue-200">
              <Users className="text-blue-500" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No se encontraron usuarios
            </h3>
            <p className="text-gray-600 mb-6">
              {search || roleFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primer usuario"}
            </p>
            {!search && roleFilter === "all" && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all font-semibold"
              >
                <UserPlus size={18} />
                Agregar Usuario
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <UserTable
              users={currentUsers}
              indexOfFirst={indexOfFirst}
              onEdit={handleOpenModal}
              onDelete={confirmDelete}
            />

            <Pagination
              pagination={pagination}
              goToPage={goToPage}
              changeItemsPerPage={changeItemsPerPage}
              getPageNumbers={getPageNumbers}
            />
          </>
        )}
      </div>

      <ModalUser
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        onUserSaved={handleUserSaved}
      />
    </div>
  );
}