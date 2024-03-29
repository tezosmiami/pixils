import React, { useState } from 'react'
import { request, gql } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'

export const getLatestSales = gql`
  query getSales ($offset: Int!, $offsetBidou: Int!) {
    objkts: events(where: {type: {_nlike: "%FX%"}, implements: {_eq: "SALE"}, token: {tags: {tag: {_ilike: "%pixel%"}, token: {metadata_status: {_eq: "processed"}}}}}, order_by: {opid: desc}, limit: 99, offset: $offset) {
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

    bidou: events(where: {implements: {_eq: "SALE"}, type: {_eq: "8BID_8X8_COLOR_BUY"}, token: {metadata_status: {_eq: "processed"}}}, order_by: {opid: desc}, limit: 33, offset: $offsetBidou) {
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

const fetcher = (key, query, offset, offsetBidou) => 
    request(process.env.REACT_APP_TEZTOK_API, query, {offset, offsetBidou})

export function sliceChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
  }
  return res;
}

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const LatestSales = () => {
  const { mutate } = useSWRConfig()
  const [pageIndex, setPageIndex] = useState(0);
  const [offset, setOffset] = useState(0)
  const [offsetBidou, setOffsetBidou] = useState(0)
 
  const { data: sales, error: error} = useSWR(['/api/sales', getLatestSales, offset, offsetBidou], fetcher, { refreshInterval: 5000 })

  if (error) return <p>Error</p>
  if (!sales) return <p>Loading. . .</p>
 
  let totalsales=sales && sales.objkts.concat(sales.bidou) 

//   totalpixils?.length > 0 && totalpixils.sort(function (a, b) {
//     return b.opid - a.opid;
//   });

    return (
      <>
      <div className='container'>
        {totalsales && shuffle(totalsales).map(p=> (
          p.token.mime_type !== null &&
          p.token.eightbid_rgb == null &&
          p.token.mime_type.includes('image') && p.token.mime_type !== 'image/svg+xml' ? 
           <a key={p.opid} href={p.token.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token.token_id}` : 
              p.type === 'VERSUM_COLLECT_SWAP' ? `https://versum.xyz/token/versum/${p.token.token_id}` :
              p.type === 'OBJKT_FULFILL_ASK_V2' ? `https://objkt.com/asset/${p.token.fa2_address}/${p.token.token_id}`
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
          p.token.eightbid_rgb !== null ?
             <a key={p.opid} href={`https://ui.8bidou.com/item/?id=${p.token.token_id}`} target="blank"  rel="noopener noreferrer">
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
          {pageIndex >= 1 && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-99); setOffsetBidou(offsetBidou-33); mutate('/api/sales')}}>Previous  &nbsp;- </button>}
          <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+99);  setOffsetBidou(offsetBidou+33); mutate('/api/sales')}}>Next</button>   
       </div>
     </>
    );
  }
  
