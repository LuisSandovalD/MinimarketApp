import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { postWhatsAppText } from "../../api/notificationWhatsApp";

export default function ModalDocuments({ show, onClose, doc }) {
  const [creditInfo, setCreditInfo] = useState(null);

  useEffect(() => {
    if (!doc?.sale) return;

    const credit = doc.sale.credit;
    if (credit) {
      const totalWithInterest =
        Number(doc.total) + Number(credit.interest_amount || 0);
      setCreditInfo({
        interest_rate: credit.interest_rate,
        interest_amount: credit.interest_amount,
        total_with_interest: totalWithInterest,
        due_date_time: credit.due_date,
      });
    } else {
      setCreditInfo(null);
    }
  }, [doc]);

  const handleSendWhatsApp = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const customer = doc.sale?.customer;

      if (!customer || !customer.phone) {
        alert("❌ El cliente no tiene número de teléfono registrado.");
        return;
      }

      const phone = customer.phone.startsWith("+51")
        ? customer.phone
        : `+51${customer.phone.replace(/\D/g, "")}`;

      const data = {
        to: phone,
        name: customer.name || "Cliente",
        total: creditInfo?.total_with_interest || doc.total || 0,
        fecha: new Date(doc.issue_date).toLocaleDateString("es-PE"),
        customer_id: customer.id || null,
        user_id: user.id,
      };

      console.log("📤 Enviando datos:", data);
      const res = await postWhatsAppText(data);
      console.log("🔍 Respuesta del backend:", res.data);

      alert(`✅ Mensaje enviado a ${customer.name} (${phone})`);
    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
      alert("Ocurrió un error al enviar el mensaje.");
    }
  };

  const sale = doc?.sale || {};

  return (
    <AnimatePresence>
      {show && doc && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white border border-gray-200 rounded-xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Comprobante de Venta
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Realizado por:</span>
                <span className="text-gray-800">
                  {JSON.parse(localStorage.getItem("user"))?.name || "—"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Cliente:</span>
                <span className="text-gray-800">{sale.customer?.name || "—"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Teléfono:</span>
                <span className="text-gray-800">{sale.customer?.phone || "—"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Tipo:</span>
                <span className="text-gray-800">{doc.document_type?.name || "—"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Serie:</span>
                <span className="text-gray-800">{doc.series || "—"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Número:</span>
                <span className="text-gray-800">{doc.number || "—"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Fecha de emisión:</span>
                <span className="text-gray-800">
                  {new Date(doc.issue_date).toLocaleDateString("es-PE")}
                </span>
              </div>

              <hr className="my-4 border-gray-200" />

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Subtotal:</span>
                <span className="text-gray-800">S/ {Number(doc.subtotal || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">IGV:</span>
                <span className="text-gray-800">S/ {Number(doc.vat || 0).toFixed(2)}</span>
              </div>

              {/* Información de crédito */}
              {creditInfo ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Interés ({creditInfo.interest_rate}%):
                    </span>
                    <span className="text-gray-800">
                      S/ {Number(creditInfo.interest_amount || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Total con Interés:</span>
                      <span className="font-semibold text-gray-800 text-base">
                        S/ {Number(creditInfo.total_with_interest || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-3">
                    <span className="text-gray-600 font-medium">
                      Fecha de pago del crédito:
                    </span>
                    <span className="text-gray-800">{creditInfo.due_date_time}</span>
                  </div>
                </>
              ) : (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total:</span>
                    <span className="font-semibold text-gray-800 text-base">
                      S/ {Number(doc.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-between gap-3">
              <button
                onClick={handleSendWhatsApp}
                className="px-5 py-2.5 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-all shadow-sm"
              >
                Enviar por WhatsApp
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}