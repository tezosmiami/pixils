import React, { useState } from 'react'
import { request } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';

const getLatestSales = `
  query getSales ($offset: Int!) {
  events (where: {implements: {_eq: "SALE"}, token: {tags: {tag: {_ilike: "%pixel%"}}}}, order_by: {opid: desc}, limit: 99, offset: $offset) {
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



export const Home = () => {
  const { mutate } = useSWRConfig()
  const [pageIndex, setPageIndex] = useState(0);
  const [offset, setOffset] = useState(0)
  const fetcher = (key,offset) => request(process.env.REACT_APP_TEZTOK_API, getLatestSales, {offset})
  const { data, error } = useSWR(['/api/sales', offset], fetcher, { refreshInterval: 5000 })
  
  
  if (error) return <p>Error</p>
  if (!data) return <p>Loading. . .</p>
    return (
      <>
  
      <div className='container'>
        {data.events.map(p=> (
         
          p.token.mime_type !== null &&
          p.token.eightbid_rgb === null &&
          p.token.mime_type.includes('image') ? 
           <a key={p.opid} href={p.token.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token.token_id}` : 
              p.type === 'VERSUM_COLLECT_SWAP' ? `https://versum.xyz/token/versum/${p.token.token_id}` :
              p.type === 'OBJKT_FULFILL_ASK_V2' ? `https://objkt.com/asset/${p.token.fa2_address}/${p.token.token_id}` 
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
                 style={{backgroundColor: `#${c}`, width: '15px', height: '15px', margin: '0' }}
              />
           )})}
              </div>
              </a>
      
        : null
        
          ))}
      <div>
        <p></p>
      </div>
    {pageIndex >= 1 &&<button  onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-99); mutate('/api/sales')}}>Previous  &nbsp;- </button>}
       <button  onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+99); mutate('/api/sales')}}>Next</button>

    </div>
<p>powered by teztok</p>

      </>
    );
  }
  