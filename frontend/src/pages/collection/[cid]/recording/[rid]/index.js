import { useRouter } from 'next/router'
import Head from "next/head";
import React from "react";

const Recording = () => {
  const router = useRouter()
  const { rid } = router.query

  return (
    <div>
      <Head>
        <title>Recording</title>
      </Head>
      <p>Recording with ID {rid}</p>
    </div>
  )
}

export default Recording;
