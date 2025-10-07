import { useState } from "react";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Social from "./components/Social";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Modal from "./components/Modal";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Skills from "./components/Skills";

function App() {
  document.title = "My Portfolio"
  const [nav, setNav] = useState(false);
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <NavBar prop={{nav:nav,setNav:setNav}}/>
      <Home />
      <About/>
      <Skills/>
      <Portfolio/>
      <Experience/>
      <Modal/>
      <Contact/>
      <Social/>
    </div>

  );
}

export default App;
