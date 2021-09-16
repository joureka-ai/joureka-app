import Head from "next/head";
import Container from "@material-ui/core/Container";
import React from "react";


const Home = () => {
  return (
    <div>
      <Head>
        <title>joureka</title>
      </Head>
      <Container maxWidth={"md"}>
        <h1>Home - Mein Arbeitsplatz</h1>
      </Container>
    </div>
  );
};

export default Home;
