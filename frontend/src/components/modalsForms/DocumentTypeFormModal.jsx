import InputField from "@/components/common/forms/InputField";
import Button from "@/components/common/buttons/Button";
import ModalBase from "@/components/common/modals/ModalBase";
import { FileText, Shield } from "lucide-react";

export default function DocumentTypeFormModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  editingId,
  errors = {},
}) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleCodeChange = (e) => {
    const upperValue = e.target.value.toUpperCase();
    onChange({
      ...e,
      target: {
        ...e.target,
        name: 'code',
        value: upperValue
      }
    });
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={editingId ? "Editar Tipo de Documento" : "Nuevo Tipo de Documento"}
      size="md"
    >
      <div className="space-y-5">
        {/* Información del tipo de documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Nombre"
            name="name"
            placeholder="Ej. Boleta de Venta"
            value={form.name}
            onChange={onChange}
            required
            error={errors.name}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="code"
                placeholder="Ej. BOL"
                value={form.code}
                onChange={handleCodeChange}
                maxLength="10"
                required
                className={`w-full px-3 py-2.5 border rounded-lg transition-all duration-200 uppercase font-semibold ${
                  errors.code
                    ? "border-red-400 ring-2 ring-red-200"
                    : "border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                } outline-none`}
              />
            </div>
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              El código se convertirá automáticamente a mayúsculas
            </p>
          </div>
        </div>

        {/* Configuración de IGV */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">
                Configuración de Impuestos
              </h4>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="requires_vat"
                  checked={form.requires_vat}
                  onChange={onChange}
                  id="requires_vat"
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                />
                <label
                  htmlFor="requires_vat"
                  className="text-sm font-medium text-slate-700 cursor-pointer select-none"
                >
                  Este tipo de documento requiere IGV (18%)
                </label>
              </div>
              <p className="text-xs text-slate-600 mt-2 ml-8">
                Si está marcado, el sistema calculará automáticamente el IGV en las transacciones con este tipo de documento
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            {editingId ? "Actualizar" : "Crear"} Tipo
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}