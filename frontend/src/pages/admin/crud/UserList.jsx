import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserRegister, deleteUser } from "../../../api/user";
import ModalUser from "../../../components/modals/ModalUser";
import NavBar from "../../../components/navbars/NavBarAdmin";
import Loading from "../../../components/common/Loading";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Estados para el modal de eliminación
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserRegister();
      setUsers(data);
    } catch {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

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
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(deleteId);
      await loadUsers();
      setMessage({ type: "success", text: "Usuario eliminado correctamente." });
    } catch {
      setMessage({ type: "error", text: "No se pudo eliminar el usuario." });
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // Ocultar mensajes automáticos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:pt-0">
      <NavBar />

      {/* Notificación */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-md text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-72 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <div className="">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold text-[#1E293B]">
              Gestión de Usuarios
            </h2>
            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="bg-[#1E293B] text-white px-5 py-2 rounded-xl shadow hover:bg-[#334155] transition"
            >
              + Agregar Usuario
            </button>
          </div>

          <p className="mb-6 text-[#64748B]">
            Total de usuarios:{" "}
            <strong className="text-[#1E293B]">{users.length}</strong>
          </p>

          {error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : users.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl py-10 text-center shadow-sm">
              <p className="text-[#64748B] text-lg">No hay usuarios registrados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-sm text-[#1E293B]">
                <thead className="bg-[#F1F5F9] text-[#475569] uppercase text-xs">
                  <tr>
                    {["N°", "Nombre", "Email", "Rol", "Permisos", "Creado", "Acciones"].map(
                      (h, i) => (
                        <th key={i} className="p-3 text-center border-b border-[#E2E8F0]">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const roleName = user.roles?.[0]?.name || "Sin rol";
                    const permissions =
                      user.roles?.[0]?.permissions?.map((p) => p.name) || [];

                    return (
                      <tr
                        key={user.id}
                        className="text-center hover:bg-[#F8FAFC] border-b border-[#E2E8F0] transition"
                      >
                        <td className="p-3 text-[#64748B]">{index + 1}</td>
                        <td className="p-3 font-medium">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 capitalize text-[#1E293B] font-semibold">
                          {roleName}
                        </td>
                        <td className="p-3">
                          {permissions.length > 0 ? (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {permissions.map((perm, i) => (
                                <span
                                  key={i}
                                  className="bg-[#E2E8F0] text-[#1E293B] px-2 py-0.5 text-xs rounded-full"
                                >
                                  {perm}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[#94A3B8] italic text-xs">
                              Sin permisos
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[#64748B]">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleOpenModal(user)}
                              className="bg-[#CBD5E1] text-[#1E293B] px-3 py-1 rounded-lg hover:bg-[#E2E8F0] transition"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => confirmDelete(user.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de crear/editar usuario */}
        <ModalUser
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
          onUserSaved={handleUserSaved}
        />

        {/* Modal de confirmación de eliminación */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              className="fixed inset-0 bg-[#1E293B]/30 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 border border-[#E2E8F0] text-center"
              >
                <h3 className="text-lg font-semibold text-[#1E293B] mb-3">
                  Confirmar eliminación
                </h3>
                <p className="text-sm text-[#64748B] mb-6">
                  ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
