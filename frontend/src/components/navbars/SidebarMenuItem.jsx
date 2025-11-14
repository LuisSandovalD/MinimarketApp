import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function SidebarMenuItem({
  item,
  isActive,
  expandedMenus,
  toggleMenu,
  closeMobileMenu,
}) {
  // ---- MENÚ CON SUBMENÚ ----
  if (item.submenu) {
    return (
      <div className="mb-1">
        <button
          onClick={() => toggleMenu(item.title)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg
          transition-all duration-300 group
          ${
            expandedMenus[item.title]
              ? "bg-blue-50 text-blue-700 shadow-sm"
              : "hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon
              size={20}
              className={`transition-colors duration-300 ${
                expandedMenus[item.title]
                  ? "text-blue-600"
                  : "text-gray-600 group-hover:text-blue-600"
              }`}
            />
            <span
              className={`font-medium text-sm ${
                expandedMenus[item.title] ? "text-blue-700" : "text-gray-700"
              }`}
            >
              {item.title}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              expandedMenus[item.title]
                ? "rotate-180 text-blue-500"
                : "text-gray-400"
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            expandedMenus[item.title]
              ? "max-h-96 opacity-100 mt-1"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="ml-3 border-l border-gray-200 pl-3 space-y-1">
            {item.submenu.map((subitem, subindex) => (
              <Link
                key={subindex}
                to={subitem.path}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300
                ${
                  isActive(subitem.path)
                    ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <subitem.icon size={17} />
                <span>{subitem.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- ITEM SIN SUBMENÚ ----
  return (
    <Link
      to={item.path}
      onClick={closeMobileMenu}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-1
      ${
        isActive(item.path)
          ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <item.icon
        size={20}
        className={`transition-colors duration-300 ${
          isActive(item.path)
            ? "text-blue-600"
            : "text-gray-600 group-hover:text-blue-600"
        }`}
      />
      <span>{item.title}</span>
    </Link>
  );
}
