export default function EmptyState({
  title = "Sin datos",
  description = "No hay información disponible.",
}) {
  return (
    <div className="text-center py-10 text-gray-500 border rounded-lg">
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
