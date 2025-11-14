export default function ShoppingError({ error }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <NavBarAdmin />
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    </div>
  );
}