import React, { useState, useEffect, useContext } from 'react'
import { useTezosContext } from "../context/tezos-context";
import { request, gql } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'
import { useParams, Link } from 'react-router-dom';



export const Objkt = ({banned}) => {
  const [objkt, setObjkt] = useState([]);
  const [message, setMessage] = useState();
  const app = useTezosContext();
  const params = useParams();
  const queryObjkt = gql`
    query objkt {
      tokens(where: {fa2_address: {_eq: "${params.contract}"}, token_id: {_eq: "${params.id}"}}) {
        artist_address
        artifact_uri
        name
        minted_at
        minter_profile {
          alias
          twitter
        }
        price
        mime_type
        description
        platform
        tags {
          tag
        }
        listings {
          price
          swap_id
          contract_address
        }
      }
    }  
    `
    useEffect(() => {
      const getObjkt = async() => {
          if (params && banned) { 
          const result = await request(process.env.REACT_APP_TEZTOK_API, queryObjkt)
          const filtered = result.tokens.filter((i) => !banned.includes(i.artist_address))
          setObjkt(filtered[0])
          }
          }
          getObjkt();
      }, [params,banned])

    if (objkt.length === 0) return <div>loading. . .<p/></div>

    const handleCollect = () => async() => {
      try {
          setMessage('Preparing Objkt. . .');
          const isCollected = await app.collect({swap_id: objkt.listings[0].swap_id, price: objkt.price,
             contract: objkt.listings[0].contract_address, platform: objkt.platform});
          setMessage(isCollected ? 'You got it!' : 'something happened, please try again. . .');
        
      } catch(e) {
          setMessage('not found - please try again. . .');
          console.log('Error: ', e);
      }
      setTimeout(() => {
          setMessage(null);
      }, 3200);
    };
console.log(objkt)
return(
  <>
  
   {objkt.mime_type?.includes('image') && objkt.mime_type !== 'image/svg+xml' ?  
    // <a 
    //   href={params.contract ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? 
    //   `https://hicetnunc.miami/objkt/${params.id}` : 
    //   params.contract === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? 
    //   `https://versum.xyz/token/versum/${params.id}`
    //   : `https://objkt.com/asset/${params.contract}/${params.id}`} target="blank"  rel="noopener noreferrer">  
    <a href = {`https://gateway.ipfs.io/ipfs/${objkt.artifact_uri.slice(7)}`} target='blank'  rel='noopener noreferrer'>
    <img alt='' className= 'view' src={'https://gateway.ipfs.io/ipfs/' + objkt.artifact_uri.slice(7)}/> 
    </a>
    // </a>
    :
    objkt.length === 1 && objkt?.mime_type?.includes('video') ?  
  //  <a key={objkt.artifact_uri+objkt.token_id} 
  //     href={objkt.fa2_address === 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ?
  //    `https://hicetnunc.miami/objkt/${objkt.token_id}` : 
  //     objkt.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? 
  //    `https://versum.xyz/token/versum/${objkt.token_id}` 
  //      : `https://objkt.com/asset/${objkt.fa2_address}/${objkt.token_id}`} target="blank"  rel="noopener noreferrer"> 
      <div className='view video'>
        <a href = {`https://gateway.ipfs.io/ipfs/${objkt.artifact_uri.slice(7)}`} target='blank'  rel='noopener noreferrer'>
         <ReactPlayer url={'https://ipfs.io/ipfs/' + objkt.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
         </a>
      </div>
    // </a> 
    : null}
    
    <div>
    <div style= {{borderBottom: '6px dotted', width: '63%', marginTop:'33px'}} />
        
        <p>{objkt.name} </p>
       
        <div style= {{borderBottom: '6px dotted', width: '63%', marginBottom: '27px'}} />

        </div>
       
        <p style={{width: '60%', textAlign: 'justify', wordWrap: 'break-word', textJustify: 'inter-word' }}> {objkt.description}</p>
        <div style= {{borderBottom: '6px dotted', width: '63%', margin: '33px'}} /> 
        {/* <a href={params.contract ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${params.id}` : 
              params.contract === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${params.id}` 
             : `https://objkt.com/asset/${params.contract}/${params.id}`} target="blank"  rel="noopener noreferrer">   */}
            <div>
            <Link to={`/${objkt.minter_profile?.alias || objkt.artist_address}`}>created by:  {objkt?.minter_profile?.alias || objkt.artist_address.substr(0, 5) + ". . ." + objkt.artist_address.substr(-5)}</Link>
            <p>{objkt.price > 0 ?
                <a onClick={handleCollect()}>{`collect for ${objkt.price/1000000}ꜩ`}</a>
                    : 'sold out'} on <a href={objkt.platform ==='HEN' ? `https://hicetnunc.miami/objkt/${params.id}` 
                    : objkt.platform === 'VERSUM' ? `https://versum.xyz/token/versum/${params.id}` 
                    : objkt.platform === '8BIDOU' ? `https://ui.8bidou.com/item/?id=${params.id}` 
                    : `https://objkt.com/asset/${params.contract}/${params.id}`} target="blank"  rel="noopener noreferrer">
                    {objkt.platform === 'HEN' ? 'H=N' : objkt.symbol === "VERSUM" ? objkt.platform 
                    : objkt.platform === '8BIDOU' ? '8BiDOU' : 'OBJKT'}</a></p>
            </div>
          {/* </a> */}
            
             <div style= {{borderBottom: '6px dotted', width: '63%', marginTop:'27px'}} />
        <div style= {{borderBottom: '6px dotted', width: '63%', marginBottom: '33px'}} />
  </>
)
}