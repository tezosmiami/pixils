import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'

export const getTotalObjkts = gql`
  query getTotal{
    tokens_aggregate(where: {editions: {_eq: "1"}, price: {_is_null: false}, mime_type: {_is_null: false}}) {
    aggregate {
      count
    }
  }
}
`
export const getLatestSales = gql`
  query getSales ($offset: Int!) {
    tokens(where: {editions: {_eq: "1"}, price: {_is_null: false}, mime_type: {_is_null: false}}, offset: $offset, limit: 108) {
      mime_type
      artifact_uri
      fa2_address
      token_id
      artist_address
    }
   }  
   ` 
const fetcher = (key, query, offset) => request(process.env.REACT_APP_TEZTOK_API, query, {offset})

export function sliceChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
  }
  return res;
}

// export function shuffle(a) {
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

export const LatestSales = () => {
  const { mutate } = useSWRConfig()
  const [pageIndex, setPageIndex] = useState(0);
  const [offset, setOffset] = useState(0)
  const [banned, setBanned] = useState()

  const axios = require('axios');

  useEffect(() => {
    const getTotal = async () => {
      const result = await request(process.env.REACT_APP_TEZTOK_API, getTotalObjkts)
      setOffset(Math.floor(Math.floor(Math.random() * result.tokens_aggregate.aggregate.count)))
  }
    getTotal();
  }, [])

  useEffect(() => {
    const getBanned = async () => {
    const result = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json') ;
    setBanned(result.data)
  }
    getBanned();
  }, [])
  
  
  // const { data: total, error: totalerror} = useSWR([`/api/total`, getTotalObjkts, null], fetcher,{ refreshInterval: 5000 })
  // setOffset(total?.tokens_aggregate.aggregate.count-108)
  const { data, error } = useSWR(offset>0 && ['/api/sales', getLatestSales, offset], fetcher, { refreshInterval: 5000 })

  if (error) return <p>Error</p>
  if (!data) return <p>Loading. . .</p>

  const final = data?.tokens.filter((i) => !banned.includes(i.artist_address))
console.log(offset)
console.log(data)
console.log(final)
//   totalpixils?.length > 0 && totalpixils.sort(function (a, b) {
//     return b.opid - a.opid;
//   });

    return (
      <>
      <div className='container'>
        {final && final.slice(0,108).map(p=> (
          // p.mime_type !== null &&
          // p.eightbid_rgb === null &&
          p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ? 
           <a key={p.artifact_uri} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
              p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 

             : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
          <img alt='' className= 'pop' key={p.artifact_uri}  src={'https://ipfs.io/ipfs/' + p.artifact_uri.slice(7)}/> 
          </a>
           :
          // p.token.mime_type !== null &&
          p.mime_type.includes('video') ?  
          <a key={p.artifact_uri} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
          p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 

         : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
           <div className='pop video'>
             <ReactPlayer url={'https://ipfs.io/ipfs/' + p.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
            </div>
            </a>
          // :
          // p.eightbid_rgb !== null ?
          //   //  <a key={p.opid} href={`https://www.8bidou.com/listing/?id=${p.token.token_id}`} target="blank"  rel="noopener noreferrer">
          //   <a key={p.token_id} href={`https://www.8bidou.com`} target="blank"  rel="noopener noreferrer">
          //      <div className='row'>
          // {sliceChunks(p.eightbid_rgb,6).map((c,i) => {
          //   return (
          //     <div
          //        key={`${c}-${i}`}
          //        style={{backgroundColor: `#${c}`, width: '15px',
          //        height: '15px', margin: '0' }}/> )})}
          //     </div>
          //     </a>
          //    :
           : null        
            ))}
       <div>
          <p></p>
       </div>
          {pageIndex >= 1 && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-99); mutate('/api/sales')}}>Previous  &nbsp;- </button>}
          <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+99); mutate('/api/sales')}}>Next</button>   
       </div>
     </>
    );
  }
  
