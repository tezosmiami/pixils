import React, { useState, useEffect } from 'react'
import { LatestSales } from '../components/latest-sales';
import { LatestMints } from '../components/latest-mints';
import { Search } from '../components/search';
import ToggleSwitch from '../components/toggle';
import { useSearchParams } from 'react-router-dom';

export const Home = () => {
  const [toggled, setToggled ] = useState(false);
  const [searchData,setSearchData] = useState([]);
  const [searchParams] = useSearchParams();
  const [banned,setBanned] = useState()
  const axios = require('axios');
  
  useEffect(() => {
    const getBanned = async () => {
    const result = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json') ;
    setBanned(result.data)
  }
    getBanned();
  }, [])
    return (
      <>
      {!searchParams.get('search') && <a>{!toggled ? 'Mints' : 'Sales'}</a>}
      {!searchParams.get('search') &&<ToggleSwitch
        isToggled={toggled}
        handleToggle={() => setToggled(!toggled)}/>}
       <Search returnSearch={setSearchData} query={searchParams.get('search')} banned={banned}/>
       {!toggled && !searchParams.get('search') ? <LatestMints /> : !searchParams.get('search') ? <LatestSales/> : null}
 
      </>
    );
  }
  
