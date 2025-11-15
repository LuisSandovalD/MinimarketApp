import ModalBase from "./ModalBase";
import { Button } from "../buttons";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de continuar?",
}) {
  return (
    <ModalBase open={open} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 mb-6">{message}</p>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </ModalBase>
  );
}
