import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'
import { useParams, Link } from 'react-router-dom';



export const getSubjkt = gql`
query Subjkt($address: String!) {
  tzprofiles(where: {alias: {_ilike: $address}}) {
      account
      twitter
    }
  }
  
`

export const getObjkts = gql`
query walletName($address: String) {
    created: tokens(where: {artist_address: {_eq: $address}, artifact_uri: {_is_null: false}, mime_type: {_is_null: false}, editions: {_eq: "1"}}, order_by: {minted_at: desc}) {
      artifact_uri
      display_uri
      artist_address
      fa2_address
      token_id
      mime_type
      platform
      minter_profile {
        alias
        twitter
        logo
      }
    }
  

  collected: tokens(where: {holdings: {holder_address: {_eq: $address}, amount: {_gte: "1"}}, artifact_uri: {_is_null: false}, mime_type: {_is_null: false}, artist_address: {_neq: $address}, editions: {_eq: "1"}}, order_by: {minted_at: desc}) {
    artifact_uri
    artist_address
    display_uri
    platform
    fa2_address
    token_id
    mime_type
  }
}
` 
   
const fetcher = (key, query, address) => request(process.env.REACT_APP_TEZTOK_API, query, {address})


export const Profile = ({banned}) => {

//   const [pageIndex, setPageIndex] = useState(0);
  const [offset, setOffset] = useState(0)
  const { account } = useParams();


  const { data: subjkt } = useSWR(account.length !== 36 ? ['/api/name', getSubjkt, account] : null, fetcher)

  const address = account?.length === 36 ? account : subjkt?.tzprofiles[0]?.account || null
  const { data, error } = useSWR(address?.length === 36 ? ['/api/profile', getObjkts, address] : null, fetcher, { refreshInterval: 15000 })
  
  if (subjkt && !address ) return <div>nada. . .</div>
  if (error) return <p>error</p>
  if (!data ) return <div>loading. . .<p/></div>
  
  // const merge = data?.recent.concat(data.random)
  // const owned = data.alias.length > 0 ? data.alias : data.pk;
  
  const filteredcreated = data?.created.filter((i) => !banned.includes(i.artist_address))
  const filteredcollected = data?.collected.filter((i) => !banned.includes(i.artist_address))
  
  //   totalpixils?.length > 0 && totalpixils.sort(function (a, b) {
//     return b.opid - a.opid;
//   });
 filteredcreated && console.log(filteredcreated[0].minter_profile?.logo)
    return (
      <>
      <p  style={{fontSize:'25px'}}>
        <a href={subjkt?.tzprofiles[0]?.twitter ? `https://twitter.com/${subjkt.tzprofiles[0].twitter}`: null} target="blank"  rel="noopener noreferrer">
        {account?.length===36 ? address.substr(0, 4) + "..." + address.substr(-4) : account}
      </a></p>
      {/* <img className='avatar' src={filteredcreated ? filteredcreated[0].minter_profile?.logo : null}/> */}
      <p>created:</p>
      <div className='container'>
        {filteredcreated && filteredcreated.map(p=> (
           <Link  key={p.artifact_uri+p.token_id} to={`/${p.fa2_address}/${p.token_id}`}>
           {p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ?
           <img alt='' className= 'pop' src={`https://ipfs.io/ipfs/${p.platform==='8BIDOU' ? p.display_uri.slice(7) : p.artifact_uri.slice(7)}`}/> 
           : p.mime_type.includes('video') ? 
            <div  className='pop video'>
              <ReactPlayer url={'https://ipfs.io/ipfs/' + p?.artifact_uri?.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
             </div>
            : ''}
            </Link>
             ))}
          </div>
          <div style= {{borderBottom: '6px dotted', width: '80%', marginTop:'33px'}} />
         <div style= {{borderBottom: '6px dotted', width: '80%'}} />
       <div>
          <p></p>
       </div>
       <p>collected:</p>
       <div className='container'>
        {filteredcollected && filteredcollected.map(p=> (
        <Link  key={p.artifact_uri+p.token_id} to={`/${p.fa2_address}/${p.token_id}`}>
        {p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ?
        <img alt='' className= 'pop'  src={'https://ipfs.io/ipfs/' + p.display_uri.slice(7)}/> 
        : p.mime_type.includes('video') ? 
         <div  className='pop video'>
           <ReactPlayer url={'https://ipfs.io/ipfs/' + p.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
          </div>
         : ''}
         </Link>
          ))}
          </div>
       <div>
          <p></p>
       </div>
     
   

       {/* <div>
          {pageIndex >= 1 && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-99); setOffsetNew(offsetNew-27); mutate('/api/objkts')}}>Previous  &nbsp;- </button>}
          <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+99); setOffsetNew(offsetNew+27); mutate('/api/objkts')}}>Next</button>   
       </div> */}
     </>
    );
  }
  
