import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Menu, X } from "lucide-react";
import AppLoading from "@/components/common/loaders/AppLoading";
import { MENU_CONFIG } from "@/config/menuConfig";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import SidebarMenuItem from "./SidebarMenuItem";
import ErrorState from "./ErrorState";
import SidebarButton from "@/components/common/buttons/SidebarButton";
import { getUser } from "@/api";

export default function NavBarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

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
          setError(true);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        })
        .finally(() => setTimeout(() => setIsLoading(false), 300));
    }
  }, [navigate]);

  const toggleMenu = (menu) =>
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const closeMobileMenu = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path;

  const menuItems = user?.roles?.includes("administrador")
    ? MENU_CONFIG.administrador
    : MENU_CONFIG.cajero;

  if (isLoading) return <AppLoading page="navegación" />;

  if (error || !user)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );

  return (
    <>
      {/* HEADER MOBILE */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 shadow-sm text-gray-800">
        <SidebarButton
          icon={LayoutDashboard}
          label="Minimarket 'Don Lucho'"
          subLabel={user.name}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          onClick={closeMobileMenu}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}

      {/* SIDEBAR MOBILE */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <SidebarHeader user={user} />
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {menuItems.map((item, index) => (
              <SidebarMenuItem
                key={index}
                item={item}
                isActive={isActive}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
                closeMobileMenu={closeMobileMenu}
              />
            ))}
          </nav>
          <SidebarFooter handleLogout={handleLogout} />
        </div>
      </aside>

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-72 bg-white text-gray-800 shadow-md border-r border-gray-200 z-40">
        <SidebarHeader user={user} />
        <nav className="flex-1 overflow-y-auto py-4 px-3 bg-gray-50/70">
          {menuItems.map((item, index) => (
            <SidebarMenuItem
              key={index}
              item={item}
              isActive={isActive}
              expandedMenus={expandedMenus}
              toggleMenu={toggleMenu}
              closeMobileMenu={() => {}}
            />
          ))}
        </nav>
        <SidebarFooter handleLogout={handleLogout} />
      </aside>

      {/* ESPACIADOR PARA MÓVIL */}
      <div className="lg:hidden h-16" />
    </>
  );
}
