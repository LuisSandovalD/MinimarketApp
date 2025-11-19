// src/components/dashboard/DateFilter.jsx

import { Calendar, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function DateFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onApply,
  onPresetSelect,
  selectedPreset,
  userRole, // Prop para indicar el rol ('administrador' o 'cajero')
}) {
  const [showPresets, setShowPresets] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  
  // Normaliza el rol para manejar mayúsculas/minúsculas y evitar errores
  const normalizedRole = userRole?.toLowerCase() || 'cajero';
  const isCashier = normalizedRole === "cajero";
  const isAdministrator = normalizedRole === "administrador";

  const presets = [
    { label: "Hoy", value: "today", icon: "📅" },
    { label: "Ayer", value: "yesterday", icon: "⏮️" },
    { label: "Últimos 7 días", value: "last7days", icon: "📊" },
    { label: "Últimos 30 días", value: "last30days", icon: "📈" },
    { label: "Este mes", value: "thisMonth", icon: "🗓️" },
    { label: "Mes anterior", value: "lastMonth", icon: "⏪" },
    { label: "Últimos 3 meses", value: "last3months", icon: "📉" },
    { label: "Últimos 6 meses", value: "last6months", icon: "📊" },
    { label: "Este año", value: "thisYear", icon: "🎯" },
    { label: "Año anterior", value: "lastYear", icon: "🔄" },
    { label: "Últimos 2 años", value: "last2years", icon: "📆" },
  ];

  // 🔹 Lógica: Si el usuario es cajero, forzar a "Hoy" en la carga inicial y cada vez que cambie el rol.
  useEffect(() => {
    if (isCashier && selectedPreset !== "today") {
      onPresetSelect("today");
    }
    // Si pasa de cajero a admin, deshabilita el modo personalizado forzado
    if (isAdministrator) {
      setCustomMode(false);
    }
  }, [userRole]); // Dependencia del rol

  const handlePresetClick = (value) => {
    onPresetSelect(value);
    setShowPresets(false);
    setCustomMode(false);
  };

  const getCurrentPresetLabel = () => {
    if (customMode) return "Personalizado";
    const preset = presets.find((p) => p.value === selectedPreset);
    return preset ? preset.label : "Seleccionar período";
  };

  // 🔹 VISTA RESTRINGIDA para cajero
  if (isCashier) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-blue-100">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Período: <span className="text-blue-700 font-semibold">Hoy (Restringido por Rol)</span>
          </span>
        </div>
      </div>
    );
  }

  // 🔹 VISTA COMPLETA para administrador
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Período:</span>
        </div>

        {/* Selector de presets */}
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="w-full flex items-center justify-between gap-2 bg-white border-2 border-blue-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <span>{getCurrentPresetLabel()}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showPresets ? "rotate-180" : ""
              }`}
            />
          </button>

          {showPresets && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
              <div className="p-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetClick(preset.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-md text-sm hover:bg-blue-50 transition flex items-center gap-2 ${
                      selectedPreset === preset.value
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => {
                    setCustomMode(true);
                    setShowPresets(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-md text-sm hover:bg-blue-50 transition flex items-center gap-2 text-gray-700"
                >
                  <span>⚙️</span>
                  <span>Personalizado</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modo personalizado */}
        {customMode && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Desde:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartChange(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Hasta:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndChange(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={onApply}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-md"
            >
              Aplicar
            </button>
          </>
        )}
      </div>
    </div>
  );
}