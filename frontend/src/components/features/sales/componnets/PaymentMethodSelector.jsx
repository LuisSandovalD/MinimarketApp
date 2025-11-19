import { CreditCard } from "lucide-react";

export default function PaymentMethodSelector({ paymentMethod, formData, setFormData }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Método de Pago <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <CreditCard 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
        />
        <select
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all hover:border-slate-300"
          value={formData.payment_method_id = 1}
          onChange={(e) =>
            setFormData({ ...formData, payment_method_id: e.target.value })
          }
        >
          <option value="" className="text-slate-400">Seleccione método</option>
          {paymentMethod?.map((pm) => (
            <option key={pm.id} value={pm.id} className="text-slate-700">
              {pm.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
