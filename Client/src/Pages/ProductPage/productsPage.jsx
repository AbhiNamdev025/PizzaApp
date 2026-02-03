import React from "react";
import ParentCard from "../../Components/Global/Cards/ParentCard/parentCard";
import Footer from "../../Components/Global/Footer/Footer";
import Header from "../../Components/Global/Header/Header";

function ProductsPage() {
  return (
    <>
      <Header />
      <ParentCard showFilters={true} />
      <Footer />
    </>
  );
}

export default ProductsPage;
