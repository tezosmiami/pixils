import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'


export const Search = ({returnSearch, query, banned}) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState(query?.toLowerCase())
    const [input, setInput] = useState()
    const [loading, setLoading] = useState(false)
    const [objkts, setObjkts] = useState([])
    const getSearch = gql`
    query querySearch {
        tokens(where: {_or: [{tags: {tag: {_ilike: ${search}}}}, {artist_profile: {alias: {_ilike: ${search}}}}],
          mime_type: {_is_null: false}, editions: {_eq: "1"}}, limit: 108, order_by: {minted_at: desc}) {
            mime_type
            artifact_uri
            fa2_address
            token_id
            artist_address
            artist_profile {
              alias
            }
          }
      }
  `
    const handleKey = (e) => {
        if (e.key == 'Enter') { 
            setSearch(e.target.value?.toLowerCase())
            setInput('')
        }
     
    }

    useEffect(() => {
    const getObjkts = async() => {
        if (search && banned) { 
        setObjkts([])
        setLoading(true)  
        returnSearch([]) 
        const result = await request(process.env.REACT_APP_TEZTOK_API, getSearch)
        const filtered = result.tokens.filter((i) => !banned.includes(i.artist_address))
        setObjkts(filtered)
        returnSearch(filtered)
        navigate({
            pathname: '/',
            search: `search=${search}`,
            replace: false
          });
         setLoading(false); 
        }
        }
        getObjkts();
    }, [search,banned])
    const isArtist = objkts.every((i) => i.artist_profile.alias === search)
    // if (search && !loading) return (<div>empty return. . .</div>)
    // if (loading) return 'loading. . .'
    console.log(search)
    return(
  <>
    <div className='container'>
    <div>
        <input
        className='reverse searchbar'
        type="text"
        name="search"
        value={input  ?? ""}
        onInput={e => setInput(e.target.value)}
        label="search ↵"
        placeholder="search ↵"
        onKeyPress={handleKey}
      />
    </div>
    <p/>
    {loading && <div> loading. . .<p/></div> }

    {query && objkts.length > 0 ? <div className='inline'> search: {isArtist ? <Link to={`/${search}`}> &nbsp;{search}</Link> : search} </div> :
     !loading && query ? <div> empty return. . .<p /> </div> : null} 
        {query && objkts.length > 0 && objkts.map(p=> (
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
           : ''
            ))}
       </div>
       
       </>
    );
  }
  