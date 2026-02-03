import React from "react";
import styles from "./homepage.module.css";
import Header from "../../Components/Global/Header/Header";
import Hero from "../../Components/Local/Hero/Hero";
import WednesdayPromo from "../../Components/Local/WednesdayPromo/WednesdayPromo";
import PremiumSection from "../../Components/Local/PremiumSection/PremiumSection";
import ParentCard from "../../Components/Global/Cards/ParentCard/parentCard";
import Footer from "../../Components/Global/Footer/Footer";
function HomePage() {
  return (
    <>
      <Header />
      <Hero />

      <PremiumSection />
      <WednesdayPromo />
      <ParentCard />
      <Footer />
    </>
  );
}

export default HomePage;
