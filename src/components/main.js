import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import useSWR, { useSWRConfig } from 'swr';
import {  Link } from "react-router-dom";
import ReactPlayer from 'react-player'
import Masonry from 'react-masonry-css'

const breakpointColumns = {
  default: 4,
  1500: 4,
  1200: 3,
  900: 2,
  600: 1
};
// export const getCount = gql`
//   query total{
//     tokens_aggregate(where: {editions: {_eq: "1"}, price: {_is_null: false}, mime_type: {_is_null: false}}) {
//     aggregate {
//       count
//     }
//   }
// }
// `
export const getObjkts = gql`
  query objkts ($offset: Int!, $offsetNew: Int!) {
    random: tokens(where: {editions: {_eq: "1"}, price: {_is_null: false}, mime_type: {_is_null: false}}, offset: $offset, limit: 81) {
      mime_type
      artifact_uri
      display_uri
      fa2_address
      token_id
      artist_address
    }

    recent: tokens(where: {editions: {_eq: "1"}, price: {_is_null: false}, mime_type: {_is_null: false}}, offset: $offsetNew, order_by: {minted_at: desc}, limit: 27) {
      mime_type
      artifact_uri
      display_uri
      fa2_address
      token_id
      artist_address
    }
  }  
   ` 
const fetcher = (key, query, offset, offsetNew) => request(process.env.REACT_APP_TEZTOK_API, query, {offset, offsetNew})

export const Main = ({banned}) => {
  const { mutate } = useSWRConfig()
  const [pageIndex, setPageIndex] = useState(0);
  const [offset, setOffset] = useState(Math.floor(Math.floor(Math.random() * 195000)))
  const [offsetNew, setOffsetNew] = useState(0)


  // useEffect(() => {
  //   const getTotal = async () => {
  //     const result = await request(process.env.REACT_APP_TEZTOK_API, getCount)
  //     setOffset(Math.floor(Math.floor(Math.random() * result.tokens_aggregate.aggregate.count)))
  // }
  //   getTotal();
  // }, [])
 
  const { data, error } = useSWR(offset>0 && ['/api/objkts', getObjkts, offset, offsetNew], fetcher, { refreshInterval: 5000 })

  if (error) return <div>nada. . .<p/></div>
  if (!data) return <div>loading. . .<p/></div>

  const final = data?.random.filter((i) => !banned.includes(i.artist_address))

    return (
      <>
      <p style={{margtinTop:0}}>recent objkts:</p>
      <Masonry
        breakpointCols={breakpointColumns}
        className='grid'
         columnClassName='column'>
        {data && data.recent.map(p=> (
           <Link className='center' key={p.artifact_uri+p.token_id} to={`/${p.fa2_address}/${p.token_id}`}>
           {p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ?
           <img alt='' className= 'pop' key={p.artifact_uri+p.token_id}  src={`https://ipfs.io/ipfs/${p?.display_uri?.slice(7) || p.artifact_uri.slice(7)}`}/> 
           : p.mime_type.includes('video') ? 
            <div className='pop video'>
              <ReactPlayer url={'https://ipfs.io/ipfs/' + p.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
             </div>
            : ''}
            </Link>   
            ))} 
        </Masonry>
        <div>
        <div style= {{borderBottom: '6px dotted', width: '80%', marginTop:'33px'}} />
        <div style= {{borderBottom: '6px dotted', width: '80%'}} />
        </div>
          <p/>
       <p>random objkts:</p>
      <Masonry
        breakpointCols={breakpointColumns}
        className='grid'
        columnClassName='column'>
        {final && final.map(p=> (
         <Link className='center' key={p.artifact_uri+p.token_id} to={`/${p.fa2_address}/${p.token_id}`}>
            {p.mime_type.includes('image') && p.mime_type !== 'image/svg+xml' ?
           <img alt='' className= 'pop' key={p.artifact_uri+p.token_id}  src={`https://ipfs.io/ipfs/${p?.display_uri?.slice(7) || p.artifact_uri.slice(7)}`}/> 
           : p.mime_type.includes('video') ? 
            <div className='pop video'>
              <ReactPlayer url={'https://ipfs.io/ipfs/' + p.artifact_uri.slice(7)} width='100%' height='100%' muted={true} playing={true} loop={true}/>
             </div>
            : ''}
            </Link>   
            ))} 
        </Masonry>
        <div>
          <p></p>
       </div>

       <div>
          {pageIndex >= 1 && <button onClick={() => {setPageIndex(pageIndex - 1); setOffset(offset-99); setOffsetNew(offsetNew-27); mutate('/api/objkts')}}>Previous  &nbsp;- </button>}
          <button onClick={() => {setPageIndex(pageIndex + 1); setOffset(offset+99); setOffsetNew(offsetNew+27); mutate('/api/objkts')}}>Next</button>   
       </div>
     </>
    );
  }
  
