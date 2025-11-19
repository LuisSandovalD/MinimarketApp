
import { useState, useRef, useEffect } from "react";

export default function SelectField({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Seleccionar...",
  required = false,
  error = "",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!open);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`w-full px-3 py-2.5 border rounded-lg bg-white text-gray-800 cursor-pointer flex justify-between items-center transition-all duration-200 ${
          error
            ? "border-red-400 ring-2 ring-red-200"
            : open
            ? "border-blue-400 ring-2 ring-blue-200"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`${!value ? "text-gray-400" : ""}`}>
          {value ? value.label || value.name : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {open && (
        <ul
          className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          role="listbox"
        >
          {options.length > 0 ? (
            options.map((opt) => (
              <li
                key={opt.id || opt.value}
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(opt);
                  }
                }}
                role="option"
                tabIndex={0}
                aria-selected={value?.id === opt.id || value?.value === opt.value}
                className="px-3 py-2.5 text-sm cursor-pointer border-b border-gray-50 last:border-0 hover:bg-blue-50 transition-colors text-gray-700"
              >
                {opt.label || opt.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-400 text-center">
              Sin opciones disponibles
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
