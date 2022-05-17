import React, { useState, useEffect } from 'react'
import { Main } from '../components/main';
import { Search } from '../components/search';
import { useSearchParams } from 'react-router-dom';
import ToggleSwitch from '../components/toggle';

export const Home = () => {
  const [toggled, setToggled ] = useState(false);
  const [searchData,setSearchData] = useState([]);
  const [searchParams] = useSearchParams();
  const [banned,setBanned] = useState()
  const axios = require('axios');
console.log(searchParams.get('search'))
  useEffect(() => {
    const getBanned = async () => {
    const result = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json') ;
    setBanned(result.data)
  }
    getBanned();
  }, [])
    return (
      <>
      {/* <a style={{marginLeft:'21px'}}>{!toggled ? 'Sales' : 'Mints'}</a> */}
      {/* <ToggleSwitch
        isToggled={toggled}
        handleToggle={() => setToggled(!toggled)}/>
       {!toggled ? <LatestSales /> : <LatestMints/>} */}
      <Search returnSearch={setSearchData} query={searchParams.get('search')} banned={banned}/>

      {!searchParams.get('search') ? <Main banned={banned}/> : null}

      </>
    );
  }
  
