import React, { useState } from 'react'
import { request, gql } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';


export const getLatestSales = gql`
  query getSales ($offset: Int!) {
    tokens(where: {editions: {_eq: "1"}, price: {_is_null: false}, mime_type: {_is_null: false}}, offset: $offset, limit: 108) {
      mime_type
      artifact_uri
      fa2_address
      token_id
    }
   }  
   ` 

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
  const [offset, setOffset] = useState(Math.floor(Math.random() * 49892))
  const fetcher = (key, query, offset) => request(process.env.REACT_APP_TEZTOK_API, query, {offset})
  const { data, error} = useSWR(['/api/sales', getLatestSales, offset], fetcher, { refreshInterval: 5000 })
console.log(data?.tokens.length)
  if (error) return <p>Error</p>
  if (!data) return <p>Loading. . .</p>
 


//   totalpixils?.length > 0 && totalpixils.sort(function (a, b) {
//     return b.opid - a.opid;
//   });

    return (
      <>
      <div className='container'>
        {data && data.tokens.map(p=> (
          // p.mime_type !== null &&
          // p.eightbid_rgb === null &&
          p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ? 
           <a key={p.token_id} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
              p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 

             : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
          <img alt='' className= 'pop' key={p.artifact_uri}  src={'https://cloudflare-ipfs.com/ipfs/' + p.artifact_uri.slice(7)}/> 
          </a>
           :
          // p.token.mime_type !== null &&
          // p.token.mime_type.includes('video') ?  
        
          // <video className='pop video' key={p.opid}  src={'https://cloudflare-ipfs.com/ipfs/' + p.token.artifact_uri.slice(7)} /> 
        
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
           null        
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
  
