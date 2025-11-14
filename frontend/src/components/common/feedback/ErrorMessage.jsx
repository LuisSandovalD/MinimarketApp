export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-white px-4 py-3 rounded-xl text-sm text-center font-light animate-shake shadow-lg">
      {message}
    </div>
  );
}
