import React from "react";
import FilterPaymentComponent from "./FilterPaymentComponent";

const CorteComponent = ({ data, itemCount }) => {
  return (
    <div>
      <FilterPaymentComponent data={data} itemCount={itemCount} />
    </div>
  );
};

export default CorteComponent;
