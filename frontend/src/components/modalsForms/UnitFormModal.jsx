import Button from "@/components/common/buttons/Button";
import InputField from "@/components/common/forms/InputField";
import ModalBase from "@/components/common/modals/ModalBase";

export default function UnitFormModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  editingId,
}) {
  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={editingId ? "Editar Unidad de Medida" : "Nueva Unidad de Medida"}
      size="md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          type="text"
          placeholder="Ejemplo: Litro"
          value={form.name}
          onChange={onChange}
          name="name"
          autoFocus
        />
        <InputField
          type="text"
          placeholder="Ejemplo: L"
          value={form.abbreviation}
          onChange={onChange}
          name="abbreviation"
        />

        <div className="flex justify-end gap-2 pt-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {editingId ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
