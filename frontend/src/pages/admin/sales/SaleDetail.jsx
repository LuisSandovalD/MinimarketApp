import { useEffect, useState } from "react";
import NavBarAdmin from "../../../components/navbars/NavBarAdmin";
import { getSalesDetail } from "../../../api/salesDetail";
import Loading from "../../../components/common/Loading";


export default function SaleDetail() {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSalesDetail();
        setDetails(data);
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalGeneral = details.reduce(
    (sum, d) => sum + parseFloat(d.subtotal || 0),
    0
  );
  
  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:pt-0 pt-16">
      <div className="flex-1 lg:ml-72 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <NavBarAdmin />
        <div className="mt-6 flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Detalles de Ventas
          </h1>

          {details.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No hay detalles registrados.</p>
            </div>
          ) : (
            <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 text-xs font-medium">
                    <tr>
                      <th className="px-4 py-3.5 border-b border-gray-200">#</th>
                      <th className="px-4 py-3.5 border-b border-gray-200">Venta</th>
                      <th className="px-4 py-3.5 border-b border-gray-200">Producto</th>
                      <th className="px-4 py-3.5 border-b border-gray-200 text-center">Cantidad</th>
                      <th className="px-4 py-3.5 border-b border-gray-200 text-center">Precio Unit.</th>
                      <th className="px-4 py-3.5 border-b border-gray-200 text-center">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail, index) => (
                      <tr
                        key={detail.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3.5 text-gray-600">{index + 1}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-gray-800">
                            #{detail.sale?.id || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {detail.product?.name ? (
                            <>
                              <span className="font-medium text-gray-800 block">
                                {detail.product.name}
                              </span>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {detail.product.code} • {detail.product.category || "—"}
                              </p>
                            </>
                          ) : (
                            <span className="text-gray-500">
                              Producto ID: {detail.product_id}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center text-gray-700">
                          {detail.quantity}
                        </td>
                        <td className="px-4 py-3.5 text-center text-gray-700">
                          S/ {parseFloat(detail.unit_price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 text-center font-semibold text-gray-800">
                          S/ {parseFloat(detail.subtotal).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 border-t-2 border-gray-300">
                      <td colSpan={5} className="px-4 py-4 text-right font-semibold text-gray-700">
                        TOTAL GENERAL:
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-gray-800 text-base">
                        S/ {totalGeneral.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}