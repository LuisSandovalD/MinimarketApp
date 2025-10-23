import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../../api/auth";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Truck,
  ShoppingCart,
  Package,
  ShoppingBag,
  TrendingUp,
  FileText,
  Grid,
  Ruler,
  CreditCard,
  DollarSign,
  X,
  ChevronDown,
  FileType,
} from "lucide-react";

export default function NavBarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
    } else {
      getUser(token)
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        })
        .finally(() => setTimeout(() => setIsLoading(false), 300));
    }
  }, [navigate]);

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // 🔒 MENÚS SEGÚN ROL
  let menuItems = [];

  if (user?.roles?.includes("administrador")) {
    menuItems = [
      { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      {
        title: "Gestión",
        icon: Users,
        submenu: [
          { title: "Usuarios", path: "/user-list", icon: Users },
          { title: "Clientes", path: "/customers-list", icon: UserCircle },
          { title: "Proveedores", path: "/suppliers-list", icon: Truck },
        ],
      },
      { title: "Tipo de Documento", path: "/documentType", icon: FileType },
      { title: "Método de Pago", path: "/PaymentMethod", icon: FileType },
      {
        title: "Inventario",
        icon: Package,
        submenu: [
          { title: "Productos", path: "/product-list", icon: Package },
          { title: "Categorías", path: "/category", icon: Grid },
          { title: "Unidad de Medida", path: "/unit", icon: Ruler },
        ],
      },
      {
        title: "Compras",
        icon: ShoppingCart,
        submenu: [
          { title: "Compras", path: "/shopping-list", icon: ShoppingCart },
          { title: "Detalles de Compra", path: "/shopping-details-list", icon: FileText },
        ],
      },
      {
        title: "Ventas",
        icon: DollarSign,
        submenu: [
          { title: "Ventas", path: "/sales-list", icon: TrendingUp },
          { title: "Detalles de Ventas", path: "/sales-details-list", icon: ShoppingBag },
        ],
      },
      { title: "Pagos a Crédito", path: "/CreditPayments", icon: CreditCard },
    ];
  } else {
    // 🔒 CAJERO LIMITADO
    menuItems = [
      { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      {
        title: "Ventas",
        icon: DollarSign,
        submenu: [
          { title: "Ventas", path: "/sales-list", icon: TrendingUp },
          { title: "Detalles de Ventas", path: "/sales-details-list", icon: ShoppingBag },
        ],
      },
      { title: "Clientes", path: "/customers-list", icon: UserCircle },
      { title: "Productos", path: "/product-list", icon: Package },
    ];
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-72 bg-[#FFFFFF] text-[#1E293B] shadow-sm border-r border-[#E2E8F0] z-50">
        {isLoading ? (
          <>
            {/* Skeleton */}
            <div className="p-6 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 bg-[#F1F5F9] rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-[#F1F5F9] rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          </>
        ) : !user ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <X className="text-red-500" size={32} />
              </div>
              <p className="text-sm text-gray-600">Error al cargar usuario</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-xs text-blue-600 hover:text-blue-700"
              >
                Recargar página
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header con nombre de usuario */}
            <div className="p-6 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <LayoutDashboard className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-[#1E293B]">
                    Minimarket "Don Lucho"
                  </h1>
                  <p className="text-xs text-[#94A3B8] capitalize">
                    Sistema de gestión
                  </p>
                </div>
              </div>
            </div>

            {/* Menú */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-[#E2E8F0]">
              {menuItems.map((item, index) => (
                <div key={index} className="mb-1">
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#F8FAFC] transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            size={20}
                            className="text-[#64748B] group-hover:text-[#1E293B]"
                          />
                          <span className="font-medium text-sm text-[#475569] group-hover:text-[#1E293B]">
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 text-[#94A3B8] ${
                            expandedMenus[item.title] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedMenus[item.title]
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subitem, subindex) => (
                            <Link
                              key={subindex}
                              to={subitem.path}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                                isActive(subitem.path)
                                  ? "bg-[#E2E8F0] text-[#1E293B] font-medium shadow-sm"
                                  : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                              }`}
                            >
                              <subitem.icon size={18} />
                              <span>{subitem.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-[#1E293B] font-medium shadow-sm border border-blue-100"
                          : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                      }`}
                    >
                      <item.icon
                        size={20}
                        className={isActive(item.path) ? "text-blue-600" : ""}
                      />
                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#E2E8F0]">
              <div className="bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] rounded-lg p-3 text-center">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#64748B]">MDL</p>
                  <p className="text-xs text-[#94A3B8]">©2025 Luis Sandoval</p>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
