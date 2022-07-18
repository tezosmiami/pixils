import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'

export function sliceChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
  }
  return res;
}

export const Search = ({returnSearch, query, banned}) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState(query?.toLowerCase())
    const [input, setInput] = useState()
    const [loading, setLoading] = useState()
    const [objkts, setObjkts] = useState()
    const [pageIndex, setPageIndex] = useState(0);
    const [offset, setOffset] = useState(0)

    const getSearch = gql`
    query querySearch {
      tokens(where: {_or: [{tags: {tag: {_eq: ${search}}}}, {artist_profile: {alias: {_eq: ${search}}}}], tags: {tag: {_ilike: "%pixel%"}}}, limit: 108, order_by: {minted_at: desc}, offset: ${offset}) {
            mime_type
            artifact_uri
            fa2_address
            token_id
            display_uri
            artist_address
            eightbid_rgb
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
        navigate({
          pathname: '/',
          search: `search=${search}`,
          replace: false
        }); 
        setLoading(true)  
        const result = await request(process.env.REACT_APP_TEZTOK_API, getSearch)
        const filtered = result?.tokens.filter((i) => !banned.includes(i.artist_address))
        setObjkts(filtered)
        returnSearch(filtered)
        setLoading(false); 
        }
        }
        getObjkts();
    }, [search,banned,offset])
    const isArtist = objkts?.every((i) => i.artist_profile?.alias === search)
    // if (search && !loading) return (<div>empty return. . .</div>)
    // if (loading) return 'loading. . .'
    return(
  <>
    <div className='container'>
    <div className='searchbar'>
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
    {loading && search && <div> <a> sorting pixils for: {search}. . .</a><p/></div> }
    {query && objkts?.length > 0 ? <div className='inline'> {isArtist ? <Link to={`/${search}`}> &nbsp;<p><a>{search}</a></p></Link> : <p><a>{`#${search}`}</a></p> } </div> :
     !loading && query && objkts?.length == 0 ? <div> nada<p /> </div> : null} 
        {query && objkts?.length > 0 &&  objkts.map(p=> (
           p?.mime_type && p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ? 
              <a key={p.artifact_uri+p.token_id} href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
                 p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` :
                 p.symbol === 'OBJKT' ? `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`:
                 p.symbol === 'GENTK' ? `https://fxhash.xyz/gentk/${p.token_id}`
                : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
             <img alt='' className= 'pop' key={p.artifact_uri+p.token_id}  src={`https://gateway.ipfs.io/ipfs/${p.display_uri ? p.display_uri?.slice(7) : p.artifact_uri.slice(7)}`}/> 
             </a>
              : p.mime_type !== null &&
              p.mime_type.includes('video') ?  
              <div key= {p.artifact_uri+p.token_id}className='pop video'>
              <a href={p.fa2_address ==='KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton' ? `https://hicetnunc.miami/objkt/${p.token_id}` : 
              p.fa2_address === 'KT1LjmAdYQCLBjwv4S2oFkEzyHVkomAf5MrW' ? `https://versum.xyz/token/versum/${p.token_id}` 
             : `https://objkt.com/asset/${p.fa2_address}/${p.token_id}`} target="blank"  rel="noopener noreferrer">  
             <ReactPlayer  url={'https://gateway.ipfs.io/ipfs/' + p.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
            </a>
            </div>
            :
             p?.eightbid_rgb ?
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
   
       </div>
       <div style={{justifyContent: 'center', margin: '18px', flexDirection: 'row'}}>
          {pageIndex >= 1 && !loading && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-108)}}>Previous  &nbsp;- </button>}
          {query && objkts?.length > 100 && !loading && <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+108)}}>Next</button>}  
          {query && objkts?.length > 100 && !loading && <p/>}
        </div>
       </>
    );
  }
  