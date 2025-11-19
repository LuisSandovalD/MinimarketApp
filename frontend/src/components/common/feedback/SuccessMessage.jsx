export default function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-green-500/20 backdrop-blur-md border border-green-400/30 text-white px-4 py-3 rounded-xl text-sm text-center font-light shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
