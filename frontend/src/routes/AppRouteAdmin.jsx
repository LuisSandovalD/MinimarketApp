import { Route } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import UserList from "../pages/admin/user/UserList";
import CustomersList from "../pages/admin/customers/CustomersList";
import SuppliersList from "../pages/admin/suppliers/SuppliersList";
import ShoppingList from "../pages/admin/shopping/ShoppingList";
import ShoppingDetail from "../pages/admin/shopping/ShoppingDetail";
import ProductsList from "../pages/admin/products/ProductsList";
import SaleList from "../pages/admin/sales/SalesList";
import SaleDetail from "../pages/admin/sales/SaleDetail";
import CategoriesCrud from "../pages/admin/products/Categories";
import UnitCrud from "../pages/admin/products/UnitCategory";
import CreditPayments from "../pages/admin/sales/CreditPayments";
import DocumentType from "../pages/admin/documents/DocumentType";
import PaymentMethod from "../pages/admin/paymentMethod/PaymentMethod"

export default function AppRouteAdmin() {
  return (
    <>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user-list" element={<UserList />} />
      <Route path="/customers-list" element={<CustomersList />} />
      <Route path="/suppliers-list" element={<SuppliersList />} />
      <Route path="/shopping-list" element={<ShoppingList />} />
      <Route path="/shopping-details-list" element={<ShoppingDetail />} />
      <Route path="/product-list" element={<ProductsList />} />
      <Route path="/sales-list" element={<SaleList />} />
      <Route path="/sales-details-list" element={<SaleDetail />} />
      <Route path="/category" element={<CategoriesCrud />} />
      <Route path="/unit" element={<UnitCrud />} />
      <Route path="/CreditPayments" element={<CreditPayments />} />
      <Route path="/DocumentType" element={<DocumentType />} />
      <Route path="/PaymentMethod" element={<PaymentMethod />} />
    </>
  );
}
