import React, { useState } from 'react'
import { request } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';
import { LightButton } from '../components/light-button';

const getLatestSales = `
  query getSales ($offset: Int!) {
    events(where: {implements: {_eq: "SALE"}, token: {tags: {tag: {_ilike: "%pixel%"}, token: {metadata_status: {_eq: "processed"}}}}}, order_by: {opid: desc}, limit: 99, offset: $offset) {
      type
      timestamp
      opid
      token {
        fa2_address
        token_id
        name
        artist_address
        mime_type
        artifact_uri
        eightbid_rgb
      }
      token_id
    }
  }
  
`
const getLatestBidous = `
query getBidous ($offset: Int!) {
  events(where: {implements: {_eq: "SALE"}, type: {_eq: "8BID_8X8_COLOR_BUY"}, token: {metadata_status: {_eq: "processed"}}}, order_by: {opid: desc}, limit: 33, offset: $offset) {
    type
    timestamp
    opid
    token {
      fa2_address
      token_id
      name
      artist_address
      mime_type
      artifact_uri
      eightbid_rgb
    }
    token_id
  }
}
 ` 

function sliceChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
  }
  return res;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const Home = () => {
  const { mutate } = useSWRConfig()
  const [pageIndex, setPageIndex] = useState(0);
  const [offset, setOffset] = useState(0)
  const [offsetBidous, setOffsetBidous] = useState(0)
  const fetcher = (key, query, offset) => request(process.env.REACT_APP_TEZTOK_API, query, {offset})
  const { data: objkts, error: objktError } = useSWR(['/api/sales', getLatestSales, offset], fetcher, { refreshInterval: 5000 })
  const { data: bidous, error: bidouError } = useSWR(['/api/bidou', getLatestBidous, offsetBidous], fetcher, { refreshInterval: 5000 })
  
  if (objktError || bidouError) return <p>Error</p>
  if (!objkts && !bidous) return <p>Loading. . .</p>
 
  let totalpixils=objkts && bidous ? objkts?.events.concat(bidous?.events) : null;
  totalpixils?.length > 0 && totalpixils.sort(function (a, b) {
    return a.opid - b.opid;
  });

    return (
      <>
      <div className='container'>
        {totalpixils && shuffle(totalpixils).map(p=> (
          p.token.mime_type !== null &&
          p.token.eightbid_rgb === null &&
          p.token.mime_type.includes('image') && p.token.mime_type !== 'image/svg+xml' ? 
           <a key={p.opid} href={p.token.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token.token_id}` : 
              p.type === 'VERSUM_COLLECT_SWAP' ? `https://versum.xyz/token/versum/${p.token.token_id}` :
              p.type === 'OBJKT_FULFILL_ASK_V2' ? `https://objkt.com/asset/${p.token.fa2_address}/${p.token.token_id}`:
              p.type === 'FX_COLLECT' ? `https://fxhash.xyz/gentk/${p.token.token_id}`
             : '/#'} target="blank"  rel="noopener noreferrer">  
          <img alt='' className= 'pop' key={p.opid}  src={'https://ipfs.io/ipfs/' + p.token.artifact_uri.slice(7)}/> 
          </a>
           :
          // p.token.mime_type !== null &&
          // p.token.mime_type.includes('video') ?  
        
          // <video className='pop video' key={p.opid}  src={'https://cloudflare-ipfs.com/ipfs/' + p.token.artifact_uri.slice(7)} /> 
        
          // :
          p.token.eightbid_rgb !== null ?
             <a key={p.opid} href={`https://www.8bidou.com/listing/?id=${p.token.token_id}`} target="blank"  rel="noopener noreferrer">
               <div className='row'>
          {sliceChunks(p.token.eightbid_rgb,6).map((c,i) => {
            return (
              <div
                 key={`${c}-${i}`}
                 style={{backgroundColor: `#${c}`, width: '15px',
                 height: '15px', margin: '0' }}/> )})}
              </div>
              </a>
             : null        
            ))}
       <div>
          <p></p>
       </div>
          {pageIndex >= 1 && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-99); setOffsetBidous(offsetBidous-33); mutate('/api/sales'); mutate('/api/bidous')}}>Previous  &nbsp;- </button>}
          <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+99);  setOffsetBidous(offsetBidous+33); mutate('/api/sales'); mutate('/api/bidous')}}>Next</button>   
       </div>
       
          <LightButton />
       <a href={`https://www.teztok.com`} target="blank"
         rel="noopener noreferrer"> indexed by teztok</a>
       <p>experimental dApp - enjoy at your own risk. . .</p>
     </>
    );
  }
  
