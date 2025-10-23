import { useEffect, useState } from "react";
import { getUnits, createUnit, putUnit, deleteUnit } from "../../../api/unit";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { PlusCircle, Edit, Trash2, Search, AlertTriangle } from "lucide-react";
import Loading from "../../../components/common/Loading";

export default function UnitCrud() {
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [form, setForm] = useState({ name: "", abbreviation: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await getUnits();
      setUnits(res);
      setFilteredUnits(res);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await putUnit(editingId, form);
      } else {
        await createUnit(form);
      }
      setForm({ name: "", abbreviation: "" });
      setEditingId(null);
      fetchUnits();
    } catch {
      // sin logs ni alerts
    }
  };

  const handleEdit = (unit) => {
    setForm({ name: unit.name, abbreviation: unit.abbreviation });
    setEditingId(unit.id);
  };

  const confirmDelete = (unit) => {
    setUnitToDelete(unit);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      if (unitToDelete) {
        await deleteUnit(unitToDelete.id);
        fetchUnits();
      }
    } catch {
      // sin logs ni alerts
    } finally {
      setShowDeleteModal(false);
      setUnitToDelete(null);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = units.filter((u) =>
      u.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUnits(filtered);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen lg:p-0 pt-16">
      <NavBarAdmin />
      <main className="flex-1 p-8 ml-0 lg:ml-72 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-[#1E293B]">
            Gestión de Unidades de Medida
          </h1>
        </div>

        {/* Formulario */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
            <PlusCircle size={20} />
            {editingId ? "Editar Unidad" : "Registrar Nueva Unidad"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
          >
            <div className="flex flex-col">
              <label className="text-sm text-[#64748B] mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                placeholder="Ejemplo: Litro"
                value={form.name}
                onChange={handleChange}
                className="border border-[#E2E8F0] rounded-lg p-2 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#CBD5E1]"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-[#64748B] mb-1">Abreviatura</label>
              <input
                type="text"
                name="abbreviation"
                placeholder="Ejemplo: L"
                value={form.abbreviation}
                onChange={handleChange}
                className="border border-[#E2E8F0] rounded-lg p-2 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#CBD5E1]"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#1E293B] text-white px-4 py-2 rounded-lg hover:bg-[#334155] transition-all shadow-sm"
            >
              {editingId ? "Actualizar" : "Agregar"}
            </button>
          </form>
        </div>

        {/* Buscador */}
        <div className="flex items-center gap-3 mb-6 bg-white border border-[#E2E8F0] rounded-lg p-3 shadow-sm">
          <Search size={20} className="text-[#64748B]" />
          <input
            type="text"
            placeholder="Buscar unidad de medida..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[#1E293B] placeholder-[#94A3B8]"
          />
        </div>

        {/* Lista de unidades */}
        {filteredUnits.length === 0 ? (
          <p className="text-center text-[#64748B] bg-white rounded-lg p-6 shadow-sm">
            No hay unidades de medida registradas.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#1E293B]">
                    {unit.name}
                  </h3>
                  <span className="text-sm font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-lg">
                    {unit.abbreviation}
                  </span>
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(unit)}
                    className="p-2 text-[#2563EB] hover:text-[#1E40AF] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => confirmDelete(unit)}
                    className="p-2 text-[#DC2626] hover:text-[#991B1B] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-[#DC2626]" size={28} />
              <h3 className="text-xl font-semibold text-[#1E293B]">
                Confirmar eliminación
              </h3>
            </div>
            <p className="text-[#475569] mb-6">
              ¿Estás seguro de que deseas eliminar la unidad{" "}
              <span className="font-medium text-[#1E293B]">
                {unitToDelete?.name}
              </span>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
