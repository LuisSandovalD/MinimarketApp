import React, { useEffect } from "react";
import { Calendar } from "lucide-react";

// Renombrado para coincidir con tu import
const DateField = ({ formData, setFormData, errors }) => {

  // 1. Lógica para establecer la fecha por defecto (15 o fin de mes)
  useEffect(() => {
    // Solo establecer el valor por defecto si es crédito Y no hay una fecha ya
    if (formData.is_credit && !formData.due_date) {
      const today = formData.date ? new Date(formData.date) : new Date();
      // Aseguramos que la fecha base no tenga zona horaria problemática
      const year = today.getUTCFullYear();
      const month = today.getUTCMonth();
      const day = today.getUTCDate();

      const day15 = 15;
      const lastDay = new Date(year, month + 1, 0).getUTCDate();

      const diff15 = Math.abs(day - day15);
      const diffLast = Math.abs(day - lastDay);
      const targetDay = diff15 <= diffLast ? day15 : lastDay;

      const newDate = new Date(Date.UTC(year, month, targetDay));
      const formattedDate = newDate.toISOString().split("T")[0];

      // 2. CORRECCIÓN: Actualizar el estado del PADRE (formData)
      setFormData(prev => ({ ...prev, due_date: formattedDate }));
    }
  }, [formData.is_credit, formData.date, formData.due_date, setFormData]);


  const handleChange = (e) => {
    const selected = new Date(e.target.value);
    // Usar UTC para evitar problemas de zona horaria con el input date
    const year = selected.getUTCFullYear();
    const month = selected.getUTCMonth();
    const day = selected.getUTCDate();
    const lastDay = new Date(year, month + 1, 0).getUTCDate();

    // Lógica para forzar día 15 o fin de mes
    const validDay = day <= 15 ? 15 : lastDay;
    const newDate = new Date(Date.UTC(year, month, validDay))
      .toISOString()
      .split("T")[0];

    // 3. CORRECCIÓN: Actualizar el estado del PADRE (formData)
    setFormData(prev => ({ ...prev, due_date: newDate }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5 flex items-center gap-2">
        <Calendar size={16} />
        Fecha de Vencimiento <span className="text-red-400">*</span>
      </label>
      <input
        type="date"
        className={`w-full border ${
          errors?.due_date ? "border-red-300" : "border-slate-200"
        } rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white transition-all`}
        
        // 4. CORRECCIÓN: Leer el valor desde el PADRE (formData)
        value={formData.due_date || ""} 
        
        onChange={handleChange}
        min={formData.date}
      />
      {errors?.due_date && (
        <p className="text-red-400 text-xs mt-1.5">{errors.due_date}</p>
      )}
    </div>
  );
};

export default DateField;