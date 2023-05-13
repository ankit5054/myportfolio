import { useState } from "react";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Social from "./components/Social";

function App() {
  const [nav, setNav] = useState(false);
  return (
    <div>
      <NavBar prop={{nav:nav,setNav:setNav}}/>
      <Home />

      <Social/>
    </div>

  );
}

export default App;
