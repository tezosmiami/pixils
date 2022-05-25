import React, { useState } from 'react'
import { request, gql } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'

export const getLatestMints = gql`
    query getLatestMints ($offset: Int!) {
      hen: events(where: {token: {metadata_status: {_eq: "processed"}, editions: {_gt: 0}, tags: {tag: {_ilike: "%pixel%"}}}, type: {_eq: "HEN_MINT"}}, limit: 33, order_by: {opid: desc}, offset: $offset) {
      opid
      type
      fa2_address
      token_id
      token {
        artifact_uri
        mime_type
      }
    }
   
     versum: events(where: {token: {metadata_status: {_eq: "processed"}, editions: {_gt: 0}, tags: {tag: {_ilike: "%pixel%"}}}, type: {_eq: "VERSUM_MINT"}}, limit: 33, order_by: {opid: desc}, offset: $offset) {
        opid
        type
        token_id
        token {
          artifact_uri
          mime_type
        }
      }
      objkt: events(where: {token: {metadata_status: {_eq: "processed"}, editions: {_gt: 0}, tags: {tag: {_ilike: "%pixel%"}}}, type: {_eq: "OBJKT_MINT_ARTIST"}}, limit: 33, order_by: {opid: desc}, offset: $offset) {
        opid
        type
        token_id
        fa2_address
        token {
          artifact_uri
          mime_type
        }
      }  

      bidou: events(where: {token: {metadata_status: {_eq: "processed"}, editions: {_gt: 0}}, type: {_eq: "8BID_8X8_COLOR_MINT"}}, limit: 33, order_by: {opid: desc}, offset: $offset) {
        opid
        type
        token_id
        token {
          artifact_uri
          mime_type
          eightbid_rgb
        }
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

export const LatestMints = () => {
  const { mutate } = useSWRConfig()
  const [pageIndex, setPageIndex] = useState(0);
  const [offset, setOffset] = useState(0)
  const fetcher = (key, query, offset) => request(process.env.REACT_APP_TEZTOK_API, query, {offset})
  const { data: mints, error: error } = useSWR(['/api/mints', getLatestMints, offset], fetcher, { refreshInterval: 5000 })


  if (error) return <p>Error</p>
  if (!mints) return <p>Loading. . .</p>
 
  let totalmints=mints && mints.hen.concat(mints.versum, mints.objkt,mints.bidou);
  totalmints?.length > 0 && totalmints?.sort(function (a, b) {
    return b.opid - a.opid;
  });

    return (
      <>
      <div className='container'>
        {totalmints && totalmints.map(p=> (
          p.token.mime_type &&
        //   p.token.eightbid_rgb === null &&
          p.token.mime_type.includes('image') && p.token.mime_type !== 'image/svg+xml' ? 
           <a key={p.opid} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
              p.type === 'VERSUM_MINT' ? `https://versum.xyz/token/versum/${p.token_id}` :
              p.type === 'OBJKT_MINT_ARTIST' ? `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`:
              p.type === 'FX_MINT' ? `https://fxhash.xyz/gentk/${p.token_id}`
             : '/#'} target="blank"  rel="noopener noreferrer">  
          <img alt='' className= 'pop' key={p.opid}  src={`https://ipfs.io/ipfs/${p.token.display_uri ? p.token.display_uri.slice(7) : p.token.artifact_uri.slice(7)}`}/> 
          </a>
           :
          p.token.mime_type !== null &&
          p.token.mime_type.includes('video') ?  
          <div key= {p.opid}className='pop video'>
          <a href={p.token.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
          p.token.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 
         : `https://objkt.com/asset/${p.token.fa2_address}/${p.token.token_id}`} target="blank"  rel="noopener noreferrer">  
         <ReactPlayer  url={'https://ipfs.io/ipfs/' + p.token.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
        </a>
        </div>
          :
          p.token.eightbid_rgb ?
             <a key={p.opid} href={`https://ui.8bidou.com/item/?id=${p.token_id}`} target="blank"  rel="noopener noreferrer" > 
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
          {pageIndex >= 1 && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-33); mutate('/api/sales')}}>Previous  &nbsp;- </button>}
          <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+33); mutate('/api/sales')}}>Next</button>   
       </div>
     </>
    );
  }
  
