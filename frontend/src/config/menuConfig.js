// src/config/menuConfig.js
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Truck,
  Layers,
  ClipboardList,
  CreditCard,
  Settings,
} from "lucide-react";

export const MENU_CONFIG = {
  administrador: [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Gestión de Productos",
      icon: Package,
      submenu: [
        { title: "Productos", path: "/product-list", icon: Package },
        { title: "Categorías", path: "/category", icon: Layers },
        { title: "Unidades", path: "/unit", icon: ClipboardList },
      ],
    },
    {
      title: "Compras",
      icon: ShoppingBag,
      submenu: [
        { title: "Lista de Compras", path: "/shopping-list", icon: ShoppingBag },
        { title: "Detalles de Compra", path: "/shopping-details-list", icon: ClipboardList },
      ],
    },
    {
      title: "Ventas",
      icon: CreditCard,
      submenu: [
        { title: "Lista de Ventas", path: "/sales-list", icon: CreditCard },
        { title: "Detalle de Venta", path: "/sales-details-list", icon: ClipboardList },
        { title: "Pagos de Crédito", path: "/CreditPayments", icon: CreditCard },
      ],
    },
    {
      title: "Clientes y Proveedores",
      icon: Users,
      submenu: [
        { title: "Clientes", path: "/customers-list", icon: Users },
        { title: "Proveedores", path: "/suppliers-list", icon: Truck },
      ],
    },
    {
      title: "Configuración del Sistema",
      icon: Settings,
      submenu: [
        { title: "Usuarios", path: "/user-list", icon: Users },
        { title: "Tipo de Documento", path: "/DocumentType", icon: ClipboardList },
        { title: "Métodos de Pago", path: "/PaymentMethod", icon: CreditCard },
      ],
    },
  ],

  cajero: [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Ventas",
      icon: CreditCard,
      submenu: [
        { title: "Lista de Ventas", path: "/sales-list", icon: CreditCard },
        { title: "Pagos de Crédito", path: "/CreditPayments", icon: CreditCard },
      ],
    },
    {
      title: "Clientes",
      path: "/customers-list",
      icon: Users,
    },
  ],
};
