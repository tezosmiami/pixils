import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom';



export const getSubjkt = gql`
query Subjkt($address: String!) {
    tzprofiles(where: {alias: {_ilike: $address}}) {
      account
    }
  }
  
`

export const getObjkts = gql`
query walletName($address: String) {
    created: tokens(where: {artist_address: {_eq: $address}, artifact_uri: {_is_null: false}, mime_type: {_is_null: false}, editions: {_eq: "1"}}, order_by: {minted_at: desc}) {
      artifact_uri
      artist_address
      fa2_address
      token_id
      mime_type
    }
  

  collected: tokens(where: {holdings: {holder_address: {_eq: $address}, amount: {_gte: "1"}}, artifact_uri: {_is_null: false}, mime_type: {_is_null: false}, artist_address: {_neq: $address}, editions: {_eq: "1"}}, order_by: {minted_at: desc}) {
    artifact_uri
    artist_address
    fa2_address
    token_id
    mime_type
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

export const Profile = () => {

//   const [pageIndex, setPageIndex] = useState(0);
  const [offset, setOffset] = useState(0)
  const [banned, setBanned] = useState()
  const { account } = useParams();
  const axios = require('axios');

//   useEffect(() => {
//     const getTotal = async () => {
//       const result = await request(process.env.REACT_APP_TEZTOK_API, getCount)
//       setOffset(Math.floor(Math.floor(Math.random() * result.tokens_aggregate.aggregate.count)))
//   }
//     getTotal();
//   }, [])

  useEffect(() => {
    const getBanned = async () => {
    const result = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json') ;
    setBanned(result.data)
  }
    getBanned();
  }, [])
  
  
  // const { data: total, error: totalerror} = useSWR([`/api/total`, getTotalObjkts, null], fetcher,{ refreshInterval: 5000 })
  // setOffset(total?.tokens_aggregate.aggregate.count-108)
  const { data: subjkt } = useSWR(account.length !== 36 ? ['/api/name', getSubjkt, account] : null, fetcher)

  const address = subjkt?.tzprofiles[0]?.account;
  const { data, error } = useSWR(address?.length === 36 ? ['/api/profile', getObjkts, address] : null, fetcher, { refreshInterval: 15000 })
  
  if (!address) return <p>nada. . .</p>
  if (error) return <p>error</p>
  if (!data) return <p>loading. . .</p>
  
  // const merge = data?.recent.concat(data.random)
  // const owned = data.alias.length > 0 ? data.alias : data.pk;

  const filteredcreated = data.created.filter((i) => !banned.includes(i.artist_address))
  const filteredcollected = data.collected.filter((i) => !banned.includes(i.artist_address))
  console.log(filteredcollected)
  //   totalpixils?.length > 0 && totalpixils.sort(function (a, b) {
//     return b.opid - a.opid;
//   });

    return (
      <>
      <p  style={{fontSize:'25px'}}>{account?.length===36 ? address.substr(0, 4) + "..." + address.substr(-4) : account}</p>
      <p>created:</p>
      <div className='container'>
        {filteredcreated && filteredcreated.map(p=> (
          // p.mime_type !== null &&
          // p.eightbid_rgb === null &&
          p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ? 
           <a key={p.artifact_uri} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
              p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 

             : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
          <img alt='' className= 'pop' key={p.artifact_uri}  src={'https://gateway.ipfs.io/ipfs/' + p.artifact_uri.slice(7)}/> 
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
          
          <div style= {{borderBottom: '6px dotted', width: '80%', marginTop:'33px'}} />
         <div style= {{borderBottom: '6px dotted', width: '80%'}} />
       <div>
          <p></p>
       </div>
      
       </div>
       <p>collected:</p>
       <div className='container'>
        {filteredcollected && filteredcollected.map(p=> (
          // p.mime_type !== null &&
          // p.eightbid_rgb === null &&
          p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ? 
           <a key={p.artifact_uri} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
              p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 

             : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
          <img alt='' className= 'pop' key={p.artifact_uri}  src={'https://gateway.ipfs.io/ipfs/' + p.artifact_uri.slice(7)}/> 
          </a>
           :
          // p.token.mime_type !== null &&
          p.token.mime_type.includes('video') ?  
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
       </div>
   

       {/* <div>
          {pageIndex >= 1 && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-99); setOffsetNew(offsetNew-27); mutate('/api/objkts')}}>Previous  &nbsp;- </button>}
          <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+99); setOffsetNew(offsetNew+27); mutate('/api/objkts')}}>Next</button>   
       </div> */}
     </>
    );
  }
  
