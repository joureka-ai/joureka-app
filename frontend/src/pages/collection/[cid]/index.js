import { useRouter } from 'next/router'
import Head from "next/head";
import React from "react";

const Collection = () => {
  const router = useRouter()
  const { cid } = router.query

  return (
    <div>
      <Head>
        <title>Collection</title>
      </Head>
      <p>Collection with ID {cid}</p>
    </div>
  )
}

export default Collection;
