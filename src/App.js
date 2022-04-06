import React from 'react'
import { useUserContext } from "./context/user-context";
import { Routes, Route, Link } from "react-router-dom";
import { Home } from './pages/Home'
import { LightButton } from './components/light-button';
import "./styles.css";

function App() {

  const  app = useUserContext();
 
  return(
    <>
    <header>
      {app.address && <a href={`https://hicetnunc.miami/tz/${app.address}`}
      target="blank" rel="noopener noreferrer"> 
        {app.name || app.address.substr(0, 5) + "..." + app.address.substr(-5)}
      </a>}
      <Link className='purple' to="/">Pixils</Link>
      
      <button onClick={() => !app.activeAccount ? app.logIn() : app.logOut()}> 
        {!app.activeAccount ? "sync" : "unsync"}
      </button>

    </header>     
    
     <div>
     <Routes>
        <Route path="/" element={<Home />} />
       

      </Routes>
    </div>
    
    </>
    )
}

export default App;
