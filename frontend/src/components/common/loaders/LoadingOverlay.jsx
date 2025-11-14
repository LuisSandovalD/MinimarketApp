import Spinner from "./Spinner";

export default function LoadingOverlay({ text = "Cargando..." }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50">
      <Spinner size={10} />
      <p className="text-white mt-3 font-medium">{text}</p>
    </div>
  );
}
