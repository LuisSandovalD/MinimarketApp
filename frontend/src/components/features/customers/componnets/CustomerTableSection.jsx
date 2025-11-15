import CustomerTable from "./CustomerTable";
import Pagination from "../../../common/Pagination";

export default function CustomerTableSection({
  currentCustomers,
  getCustomerCredits,
  setSelectedCustomer,
  setModalOpen,
  setSelectedCustomerSales,
  setModalSalesOpen,
  setSelectedCustomerCredits,
  setModalCreditsOpen,
  handleDeleteCustomer,
  pagination,
  goToPage,
  changeItemsPerPage,
  getPageNumbers
}) {
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <CustomerTable
            currentCustomers={currentCustomers}
            getCustomerCredits={getCustomerCredits}
            setSelectedCustomer={setSelectedCustomer}
            setModalOpen={setModalOpen}
            setSelectedCustomerSales={setSelectedCustomerSales}
            setModalSalesOpen={setModalSalesOpen}
            setSelectedCustomerCredits={setSelectedCustomerCredits}
            setModalCreditsOpen={setModalCreditsOpen}
            handleDeleteCustomer={handleDeleteCustomer}
          />
        </div>
      </div>

      <Pagination
        pagination={pagination}
        goToPage={goToPage}
        changeItemsPerPage={changeItemsPerPage}
        getPageNumbers={getPageNumbers}
      />
    </>
  );
}
