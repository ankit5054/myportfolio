import { useState } from "react";
import NavBar from "./components/NavBar";
import Social from "./components/Social";
import Home from "./components/Home";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Skills from "./components/Skills";
import SEO from "./components/SEO";

function App() {
  const [nav, setNav] = useState(false);
  
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen overflow-x-hidden w-full">
      <SEO />
      <NavBar prop={{nav:nav,setNav:setNav}}/>
      <div className="pt-16 w-full overflow-x-hidden">
        <Home />
        <About/>
        <Skills/>
        <Portfolio/>
        <Experience/>
        <Contact/>
        <Social/>
      </div>
    </div>
  );
}

export default App;