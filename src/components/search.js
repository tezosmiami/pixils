import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import useSWR, { useSWRConfig } from 'swr';
import ReactPlayer from 'react-player'
const getSearch = gql`
    query querySearch($word: String!){
      aliases: tokens(where: {editions: {_eq: "1"}, artifact_uri: {_is_null: false}, artist_profile: {alias: {_eq: $word}},
        mime_type: {_is_null: false}}, limit: 108, order_by: {minted_at: desc}) {
          mime_type
          artifact_uri
          display_uri
          fa2_address
          token_id
          artist_address
      }
      tags: tokens(where: {tags: {tag: {_eq: $word}}, artifact_uri: {_is_null: false},
        mime_type: {_is_null: false}, editions: {_eq: "1"}}, limit: 108, order_by: {minted_at: desc}) {
          mime_type
          artifact_uri
          display_uri
          fa2_address
          token_id
          artist_address

      }
    }`
export const Search = ({returnSearch, query, banned}) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState(query?.toLowerCase())
    const [input, setInput] = useState()
    const [loading, setLoading] = useState()
    const [objkts, setObjkts] = useState()

  //   const getSearch = gql`
  //   query querySearch {
  //       tokens(where: {_or: [{tags: {tag: {_ilike: ${search}}}}, {artist_profile: {alias: {_ilike: ${search}}}}],
  //         mime_type: {_is_null: false}, editions: {_eq: "1"}}, limit: 108, order_by: {minted_at: desc}) {
  //           mime_type
  //           artifact_uri
  //           fa2_address
  //           token_id
  //           artist_address
  //           artist_profile {
  //             alias
  //           }
  //         }
  //     }
  // `
  

    const handleKey = (e) => {
        if (e.key == 'Enter') { 
            setSearch(e.target.value)
            setInput('')
        }
     
    }

    useEffect(() => {
    const getObjkts = async() => {
        if (search && banned) { 
        setObjkts([])
        setLoading(true)  
        const result = await request(process.env.REACT_APP_TEZTOK_API,  getSearch, {word: search})
        const aliases = result.aliases.filter((i) => !banned.includes(i.artist_address))
        const tags = result.tags.filter((i) => !banned.includes(i.artist_address))
        const tags_artifacts = new Set(tags.map(({ artifact_uri }) => artifact_uri));
        const total = [
          ...tags,
          ...aliases.filter(({ artifact_uri }) => !tags_artifacts.has(artifact_uri))
        ];
        setObjkts(total)
        returnSearch(total)
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
    const isArtist = objkts?.every((i) => i.artist_profile?.alias === search)
    // if (search && !loading) return (<div>empty return. . .</div>)
    // if (loading) return 'loading. . .'

    return(
  <>
    <div className='container'>
    <div>
        <input
        className='reverse searchbar'
        type="text"
        name="search"
        value={input  ?? ""}
        onInput={e => setInput(String(e.target.value))}
        label="search ↵"
        placeholder="search ↵"
        onKeyPress={handleKey}
      />
    </div>
    <p/>
    {loading && search && <div> searching: {search}. . .<p/></div> }

    {query && objkts?.length > 0 ? <div className='inline'> {isArtist ? <Link to={`/${search}`}> &nbsp;{search}</Link> : search} </div> :
     !loading && query && objkts ? <div> empty return. . .<p /> </div> : null} 
        {query && objkts?.length > 0 && objkts.map(p=> (
           <Link  key={p.artifact_uri+p.token_id} to={`/${p.fa2_address}/${p.token_id}`}>
          {p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ?
          <img alt='' className= 'pop'  src={`https://ipfs.io/ipfs/${p.display_uri.slice(7) || p.artifact_uri.slice(7)}`}/> 
          : p.mime_type.includes('video') ? 
           <div className='pop video'>
             <ReactPlayer url={'https://ipfs.io/ipfs/' + p.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
            </div>
           : ''}
           </Link>
            ))}
       </div>
       
       </>
    );
  }
  