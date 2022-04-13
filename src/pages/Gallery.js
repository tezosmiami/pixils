import React, { useState, useEffect } from 'react'
import useSWR from 'swr';
import { request, gql } from 'graphql-request'
import { useParams } from 'react-router-dom';
import { Created } from '../components/created';
import { Collected } from '../components/collected';
import ToggleSwitch from '../components/toggle';
const axios = require('axios');

export const getSubjkt = gql`
query Subjkt($address: String!) {
    tzprofiles(where: {alias: {_ilike: $address}}) {
      account
    }
  }
  
`
const fetcher = (key, query, address) => request(process.env.REACT_APP_TEZTOK_API, query, {address})

export const Gallery = () => {
  const [toggled, setToggled ] = useState(false);
  const [banned, setBanned] = useState()
  const { account } = useParams();
  const { data: subjkt } = useSWR(account.length !== 36 ? ['/api/name', getSubjkt, account] : null, fetcher)
  const address = account.length !== 36 ? subjkt?.tzprofiles[0].account : account;

  useEffect(() => {
    const getBanned = async () => {
    const result = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json') ;
    setBanned(result.data)
  }
    getBanned();
  }, [])

    return (
      <>
      <a style={{marginLeft:'21px'}}>{!toggled ? 'Created' : 'Collected'}</a> 
       <ToggleSwitch
        isToggled={toggled}
        handleToggle={() => setToggled(!toggled)}/>
       {!toggled ? <Created address={address} banned={banned}/> : <Collected address={address} banned={banned}/>}
      </>
    );
  }
  
