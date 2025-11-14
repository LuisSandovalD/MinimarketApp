import Button from "@/components/common/buttons/Button";
import InputField from "@/components/common/forms/InputField";
import TextAreaField from "@/components/common/forms/TextAreaField";
import SelectField from "@/components/common/forms/SelectField";
import ModalBase from "@/components/common/modals/ModalBase";

export default function CategoryFormModal({
  open,
  onClose,
  form,
  units,
  onChange,
  onSubmit,
  editingId,
  errors = {},
}) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={editingId ? "Editar Categoría" : "Nueva Categoría"}
      size="md"
    >
      <div onSubmit={handleFormSubmit} className="space-y-5">
        <InputField
          label="Nombre"
          name="name"
          placeholder="Ej. Bebidas"
          value={form.name}
          onChange={onChange}
          required
          error={errors.name}
        />

        <TextAreaField
          label="Descripción"
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Ej. Productos líquidos para consumo"
          error={errors.description}
        />

        <SelectField
          label="Unidad de Medida"
          options={units.map((u) => ({
            id: u.id,
            name: `${u.name} (${u.abbreviation})`,
          }))}
          value={units.find((u) => u.id === form.unit_id) || null}
          onChange={(option) =>
            onChange({
              target: {
                name: "unit_id",
                value: option.id,
              },
            })
          }
          required
          error={errors.unit_id}
        />

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={onChange}
            id="active"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            Categoría activa
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            {editingId ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}