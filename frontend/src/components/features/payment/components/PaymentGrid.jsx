import React from "react";
import { AnimatePresence } from "framer-motion";
import { PaymentCard } from "./PaymentCard";

export const PaymentGrid = ({ methods, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <AnimatePresence mode="popLayout">
      {methods.map((method) => (
        <PaymentCard
          key={method.id}
          method={method}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </AnimatePresence>
  </div>
);