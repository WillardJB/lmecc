import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import News from "./pages/News";
import Chatbot from "./pages/chatbot";  // Add this import
import "./styles/Shared.css";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <About />
        <Services />
        <Team />
        <News />
        <Contact />
      </main>
      <Footer />
      <Chatbot />  
    </>
  );
};

export default App;