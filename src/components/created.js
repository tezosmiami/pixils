import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom';

export const getObjkts = gql`
query walletName($address: String) {
    alias: holdings(where: {token: {artifact_uri: {_is_null: false}, mime_type: {_is_null: false}, editions: {_eq: "1"}, holdings: {amount: {_eq: "1"}}}, holder_profile: {alias: {_ilike: $address}}, amount: {_eq: "1"}}, order_by: {token: {minted_at: desc}}) {
      token {
        artifact_uri
        artist_address
        fa2_address
        token_id
        mime_type
      }
    }
   
    pk: holdings(where: {token: {artifact_uri: {_is_null: false}, mime_type: {_is_null: false}, editions: {_eq: "1"}, holdings: {amount: {_eq: "1"}}}, holder_profile: {account: {_ilike: $address}}, amount: {_eq: "1"}}, order_by: {token: {minted_at: desc}}) {
        token {
          artifact_uri
          artist_address
          fa2_address
          token_id
          mime_type
        }
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
  const [banned, setBanned] = useState()
  const { address } = useParams();
  const axios = require('axios');

//   useEffect(() => {
//     const getTotal = async () => {
//       const result = await request(process.env.REACT_APP_TEZTOK_API, getCount)
//       setOffset(Math.floor(Math.floor(Math.random() * result.tokens_aggregate.aggregate.count)))
//   }
//     getTotal();
//   }, [])

  // useEffect(() => {
  //   const getBanned = async () => {
  //   const result = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json') ;
  //   setBanned(result.data)
  // }
  //   getBanned();
  // }, [])
  
  
  // const { data: total, error: totalerror} = useSWR([`/api/total`, getTotalObjkts, null], fetcher,{ refreshInterval: 5000 })
  // setOffset(total?.tokens_aggregate.aggregate.count-108)
  const { data, error } = useSWR(address && ['/api/name', getObjkts, address], fetcher, { refreshInterval: 15000 })


  if (error) return <p>error</p>
  if (!data) return <p>loading. . .</p>

  // const merge = data?.recent.concat(data.random)
  // const owned = data.alias.length > 0 ? data.alias : data.pk;

  const created = data?.filter((i) => !banned.includes(i.token.artist_address))

//   totalpixils?.length > 0 && totalpixils.sort(function (a, b) {
//     return b.opid - a.opid;
//   });

    return (
      <>
      <p>{account?.length===36 ? address.substr(0, 4) + "..." + address.substr(-4) : account}</p>
      <div className='container'>
        {created && created.map(p=> (
          // p.mime_type !== null &&
          // p.eightbid_rgb === null &&
          p.token.mime_type.includes('image') && p.token.mime_type !== 'image/svg+xml' ? 
           <a key={p.token.artifact_uri} href={p.token.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token.token_id}` : 
              p.token.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token.token_id}` 

             : `https://objkt.com/asset/${p.token.fa2_address}/${p.token.token_id}`} target="blank"  rel="noopener noreferrer">  
          <img alt='' className= 'pop' key={p.token.artifact_uri}  src={'https://gateway.ipfs.io/ipfs/' + p.token.artifact_uri.slice(7)}/> 
          </a>
           :
          // p.token.mime_type !== null &&
          p.token.mime_type.includes('video') ?  
          <a key={p.token.artifact_uri} href={p.token.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token.token_id}` : 
          p.token.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token.token_id}` 

         : `https://objkt.com/asset/${p.token.fa2_address}/${p.token.token_id}`} target="blank"  rel="noopener noreferrer">  
           <div className='pop video'>
             <ReactPlayer url={'https://ipfs.io/ipfs/' + p.token.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
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
       </div>
   
       {/* <div>
          {pageIndex >= 1 && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-99); setOffsetNew(offsetNew-27); mutate('/api/objkts')}}>Previous  &nbsp;- </button>}
          <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+99); setOffsetNew(offsetNew+27); mutate('/api/objkts')}}>Next</button>   
       </div> */}
     </>
    );
  }
  
