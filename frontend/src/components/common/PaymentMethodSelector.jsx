import { useState } from "react";

export default function PaymentMethodSelector({ paymentMethod, formData, setFormData }) {
  const [showQR, setShowQR] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  const handleShowQR = (methodName) => {
    if (methodName.toLowerCase().includes("yape")) {
      setSelectedQR("/src/assets/img/codigoQR.jpg"); 
    } else if (methodName.toLowerCase().includes("plin")) {
      setSelectedQR("/images/plin_qr.png");
    }
    setShowQR(true);
  };

  const selectedMethod = paymentMethod?.find(
    (pm) => pm.id === Number(formData.payment_method_id)
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Método de Pago <span className="text-red-500">*</span>
      </label>
      <select
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        value={formData.payment_method_id}
        onChange={(e) =>
          setFormData({ ...formData, payment_method_id: e.target.value })
        }
      >
        <option value="">Seleccione método</option>
        {paymentMethod?.map((pm) => (
          <option key={pm.id} value={pm.id}>
            {pm.name}
          </option>
        ))}
      </select>

      {selectedMethod &&
        (selectedMethod.name.toLowerCase().includes("yape") ||
          selectedMethod.name.toLowerCase().includes("plin")) && (
          <button
            type="button"
            onClick={() => handleShowQR(selectedMethod.name)}
            className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Mostrar código
          </button>
        )}

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-3">Escanea el código QR</h2>
            <img src={selectedQR} alt="Código QR" className="w-48 mx-auto mb-4" />
            <button
              onClick={() => setShowQR(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
