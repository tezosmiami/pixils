import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import useSWR from 'swr';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom';
import {sliceChunks} from './latest-sales';


export const getObjkts = gql`
query wallet($address: String) {
  created: tokens(where: {_and: [{minter_address: {_eq: $address}}, {_or: [{tags: {tag: {_ilike: "%pixel%"}}}, {fa2_address: {_eq: "KT1MxDwChiDwd6WBVs24g1NjERUoK622ZEFp"}}]}], editions: {_gte: "1"}}, order_by: {minted_at: desc}) {
    artifact_uri
    fa2_address
    mime_type
    minted_at
    artist_address
    eightbid_rgb
    token_id
}
} 
` 
const fetcher = (key, query, address) => request(process.env.REACT_APP_TEZTOK_API, query, {address})

// export function sliceChunks(arr, chunkSize) {
//   const res = [];
//   for (let i = 0; i < arr.length; i += chunkSize) {
//       const chunk = arr.slice(i, i + chunkSize);
//       res.push(chunk);
//   }
//   return res;
// }

// export function shuffle(a) {
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

export const Created = ({ address, banned }) => {

//   const [pageIndex, setPageIndex] = useState(0);
  const [offset, setOffset] = useState(0)

  const { account } = useParams();

//   useEffect(() => {
//     const getTotal = async () => {
//       const result = await request(process.env.REACT_APP_TEZTOK_API, getCount)
//       setOffset(Math.floor(Math.floor(Math.random() * result.tokens_aggregate.aggregate.count)))
//   }
//     getTotal();
//   }, [])

  

  // const { data: total, error: totalerror} = useSWR([`/api/total`, getTotalObjkts, null], fetcher,{ refreshInterval: 5000 })
  // setOffset(total?.tokens_aggregate.aggregate.count-108)

  
  const { data, error } = useSWR(address && ['/api/created', getObjkts, address], fetcher)

  if (error) return <p>Error</p>
  if (!data) return <p>Loading. . .</p>

  //aconst merge = data?.recent.concat(data.random)
 
  // const owned = data?.alias.length > 0 ? data.alias.concat(data.aliasBidou) : data.pk.concat(data.pkBidou);

  const created = data?.created.filter((i) => !banned.includes(i.artist_address))

//   final?.length > 0 && final.sort(function (a, b) {
//     return b?.token.minted_at.getTime() - a?.token.minted_at.getTime();
//   });
    return (
      <>
      <p style={{fontSize:'25px', marginLeft: '21px'}}>{account.length===36 ? address.substr(0, 4) + "..." + address.substr(-4) :  account}</p>
      <div className='container'>
        {created && created.map(p=> (
          p.mime_type !== null &&
          p.eightbid_rgb == null &&
          p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ? 
           <a key={p.artifact_uri} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
              p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 
             : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
          <img alt='' className= 'pop' key={p.artifact_uri}  src={`https://ipfs.io/ipfs/${p.display_uri ? p.display_uri.slice(7) : p.artifact_uri?.slice(7)}`}/> 
          </a>
           :
          p.mime_type !== null &&
          p.mime_type.includes('video') ?  
          <a key={p.artifact_uri} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
          p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 

         : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
           <div className='pop video'>
           <a key={p.artifact_uri} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
              p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 
             : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
             <ReactPlayer url={'https://ipfs.io/ipfs/' + p.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
              </a>
            </div>
            </a>
          :
          p.eightbid_rgb !== null ?
  
            <a key={p.token_id} href={`https://ui.8bidou.com/item/?id=${p.token.token_id}`} target="blank"  rel="noopener noreferrer">
               <div className='row'>
          {sliceChunks(p?.eightbid_rgb,6).map((c,i) => {
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
       </div>

       {/* <div>
          {pageIndex >= 1 && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-99); setOffsetNew(offsetNew-27); mutate('/api/objkts')}}>Previous  &nbsp;- </button>}
          <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+99); setOffsetNew(offsetNew+27); mutate('/api/objkts')}}>Next</button>   
       </div> */}
     </>
    );
  }
  
