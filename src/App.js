import React, { useEffect } from 'react'
import { useUserContext } from "./context/user-context";
import { Routes, Route, Link } from "react-router-dom";
import { Home } from './pages/Home'
import { Gallery } from './pages/Gallery'
import { LightButton } from './components/light-button';
import "./styles/styles.css";

const fonts = ['Halo', 'Advantage', 'Faster One']
function App() {

  const  app = useUserContext();


useEffect(() => {
    var r = document.querySelector(':root')
    r.style.setProperty('--font', fonts[Math.floor(Math.random()* fonts.length)])
  }, [])

  return(
    <>
    <header>
    {app.address && <Link to={`/${app.name || app.address}`}>
      {/* {app.address && <a href={`https://hicetnunc.miami/tz/${app.address}`}
      target="blank" rel="noopener noreferrer"> 
       */}
        {app.name + ' / '|| app.address.substr(0, 4) + "..." + app.address.substr(-4)+' / '}
      {/* </a>} */}
      </Link>}
    
  
      <button onClick={() => !app.activeAccount ? app.logIn() : app.logOut()}> 
        {!app.activeAccount ? "sync" : "unsync"}
      </button>

    </header>     
    <Link className='purple' to="/">S1NGULARE</Link>
     <p>1/1 TEZOS OBJKTS</p>
    <LightButton />

     <div>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/:account' element={<Gallery />} />

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
