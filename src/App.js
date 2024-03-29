import React from 'react'
import { useTezosContext } from "./context/tezos-context";
import { Routes, Route, Link } from "react-router-dom";
import { Home } from './pages/Home'
import { Gallery } from './pages/Gallery'
import { LightButton } from './components/light-button';
import "./styles.css";

function App() {

  const  app = useTezosContext();
 
  return(
    <>
    <header>
    <Link className='purple' to="/">Pixils</Link>
    <p>
    {app.address && <Link to={`/${app.name || app.address}`}>
        {app.name || app.address.substr(0, 4) + "..." + app.address.substr(-4)}
      </Link>}
      {app.activeAccount && <a className='purple'> /</a>}
      <button onClick={() => !app.activeAccount ? app.logIn() : app.logOut()}> 
       {!app.activeAccount ? "sync" : "unsync"} 
      </button>
      </p>
    </header>     
    
     <div>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:account" element={<Gallery />} />

      </Routes>
    </div>
    <LightButton />
       <a href={`https://www.teztok.com`} target="blank"
         rel="noopener noreferrer"> indexed by teztok</a>
       <p>experimental dApp - enjoy at your own risk. . .</p>
    </>
    )
}

export default App;
