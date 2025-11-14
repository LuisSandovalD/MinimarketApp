export default function AlertMessage({ message, type = "info" }) {
  if (!message) return null;

  const colors = {
    success: "bg-green-500/20 border-green-400/30 text-white",
    error: "bg-red-500/20 border-red-400/30 text-white",
    warning: "bg-yellow-500/20 border-yellow-400/30 text-white",
    info: "bg-blue-500/20 border-blue-400/30 text-white",
  };

  return (
    <div
      className={`backdrop-blur-md border px-4 py-3 rounded-xl text-sm text-center font-light shadow-lg animate-fade-in ${colors[type]}`}
    >
      {message}
    </div>
  );
}
