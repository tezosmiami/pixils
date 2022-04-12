import React, { useState } from 'react'
import { Main } from '../components/main';
import { LatestMints } from '../components/latest-mints';
import ToggleSwitch from '../components/toggle';

export const Home = () => {
  const [toggled, setToggled ] = useState(false);
    return (
      <>
      {/* <a style={{marginLeft:'21px'}}>{!toggled ? 'Sales' : 'Mints'}</a> */}
      {/* <ToggleSwitch
        isToggled={toggled}
        handleToggle={() => setToggled(!toggled)}/>
       {!toggled ? <LatestSales /> : <LatestMints/>} */}
       <Main />
      </>
    );
  }
  
