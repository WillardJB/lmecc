import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import News from "./pages/News";   // <-- no .tsx extension here
import "./styles/Shared.css";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <About />
        <Services />
        <Team />
        <News />      {/* Moved below Team */}
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
