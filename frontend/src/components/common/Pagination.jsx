export default function Pagination({
  pagination,          // objeto: { currentPage, itemsPerPage, totalItems, totalPages }
  goToPage,            // función: cambia página
  changeItemsPerPage,  // función: cambia cantidad por página
  getPageNumbers,      // función: genera lista de páginas [1, 2, 3, '...', 10]
}) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Información de registros */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">
            Mostrando{" "}
            <span className="font-semibold text-slate-800">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{" "}
            a{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-slate-800">
              {pagination.totalItems}
            </span>{" "}
            registros
          </div>

          {/* Selector de items por página */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Por página:</label>
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => changeItemsPerPage(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 bg-white"
            >
              {[6, 9, 12, 18, 24].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controles de paginación */}
        <div className="flex items-center gap-2">
          {/* Primera página */}
          <button
            onClick={() => goToPage(1)}
            disabled={pagination.currentPage === 1}
            className={`p-2 rounded-lg border transition-all ${
              pagination.currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-gray-300 hover:border-blue-300"
            }`}
            title="Primera página"
          >
            {"<<"}
          </button>

          {/* Página anterior */}
          <button
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`p-2 rounded-lg border transition-all ${
              pagination.currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-gray-300 hover:border-blue-300"
            }`}
            title="Página anterior"
          >
            {"<"}
          </button>

          {/* Números de página */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-slate-600"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`min-w-[40px] px-3 py-2 rounded-lg border transition-all font-medium ${
                    pagination.currentPage === page
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-md"
                      : "bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* Indicador móvil */}
          <div className="sm:hidden px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-semibold text-blue-700">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
          </div>

          {/* Página siguiente */}
          <button
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`p-2 rounded-lg border transition-all ${
              pagination.currentPage === pagination.totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-gray-300 hover:border-blue-300"
            }`}
            title="Página siguiente"
          >
            {">"}
          </button>

          {/* Última página */}
          <button
            onClick={() => goToPage(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`p-2 rounded-lg border transition-all ${
              pagination.currentPage === pagination.totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-gray-300 hover:border-blue-300"
            }`}
            title="Última página"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}
