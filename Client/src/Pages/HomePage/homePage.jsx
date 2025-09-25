import React from "react";
import styles from "./homepage.module.css";
import Header from "../../Components/Global/Header/Header";
import Hero from "../../Components/Local/Hero/Hero";
import ParentCard from "../../Components/Global/Cards/ParentCard/parentCard";
import Footer from "../../Components/Global/Footer/Footer";
function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <ParentCard/>
      <Footer/>
    </>
  );
}

export default HomePage;
