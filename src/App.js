import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./utils/sentry"; // Initialize Sentry
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Social from "./components/Social";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Skills from "./components/Skills";
import Services from "./components/Services";
import BookingPage from "./components/BookingPage";
import PaymentSuccess from "./components/PaymentSuccess";
import OrderSummary from "./components/OrderSummary";
import SEO from "./components/SEO";

function App() {
  const [nav, setNav] = useState(false);
  
  const MainPortfolio = () => {
    useEffect(() => {
      document.title = "Ankit Mishra - Full Stack Developer | Portfolio";
    }, []);
    
    return (
      <>
        <SEO />
        <NavBar prop={{nav:nav,setNav:setNav}}/>
        <div className="pt-16 w-full overflow-x-hidden">
          <Home />
          <About/>
          <Skills/>
          <Portfolio/>
          <Services/>
          <Experience/>
          <Contact/>
          <Social/>
        </div>
      </>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen overflow-x-hidden w-full">
      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/book/:serviceId" element={<BookingPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/order-summary" element={<OrderSummary />} />
      </Routes>
    </div>
  );
}

export default App;