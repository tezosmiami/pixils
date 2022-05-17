import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { useNavigate, useSearchParams } from "react-router-dom";
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'


export const Search = ({returnSearch, search}) => {
    const navigate = useNavigate();
    const [tag, setTag] = useState(search)
    const [input, setInput] = useState()
    const [objkts, setObjkts] = useState([])
    const getByTag = gql`
    query tags {
        tags: tokens(where: {_or: [{tags: {tag: {_ilike: ${tag}}}}, {artist_profile: {alias: {_ilike: ${tag}}}}],
          mime_type: {_is_null: false}, editions: {_eq: "1"}}, limit: 108, order_by: {minted_at: desc}) {
            mime_type
            artifact_uri
            fa2_address
            token_id
            artist_address
          }
      }
  `
    const handleKey = (e) => {
        if (e.key == 'Enter') { 
            setTag(e.target.value)
            setInput('')
        }
     
    }


    useEffect(() => {
    const getObjkts = async() => {
        if (tag) { 
        const result = await request(process.env.REACT_APP_TEZTOK_API, getByTag)
        setObjkts(result.tags)
        returnSearch(result.tags)
        navigate({
            pathname: '/',
            search: `search=${tag}`,
            replace: false
          });
        }
        }
        getObjkts();
    }, [tag])


    return(
  <>
    <div className='container'>
    <div>
        <input
        className='reverse'
        type="text"
        name="search"
        value={input  ?? ""}
        onInput={e => setInput(e.target.value)}
        label="search ↵"
        placeholder="search ↵"
        onKeyPress={handleKey}
      />
        <p />
    </div>
    {search && objkts.length > 0 && <div> search: {tag}<p /> </div>}
        {search && objkts.length > 0 && objkts.map(p=> (
           p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ? 
           <a key={p.artifact_uri+p.token_id} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
              p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 

             : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
          <img alt='' className= 'pop' key={p.artifact_uri}  src={'https://gateway.ipfs.io/ipfs/' + p.artifact_uri.slice(7)}/> 
          </a>
           :
          p.mime_type.includes('video') ?  
          <a key={p.artifact_uri+p.token_id} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
          p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 

         : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
           <div className='pop video'>
             <ReactPlayer url={'https://ipfs.io/ipfs/' + p.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
            </div>
            </a>
           : null        
            ))}
       </div>
       
       </>
    );
  }
  