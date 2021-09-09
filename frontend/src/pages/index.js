import Head from "next/head";
import Container from "@material-ui/core/Container";
import React from "react";
import DeleteIcon from '@material-ui/icons/Delete';


const Home = () => {
  return (
    <div>
      <Head>
        <title>joureka</title>
      </Head>
      <Container maxWidth={"md"}>
        <h1>Home - Mein Arbeitsplatz</h1>
        <DeleteIcon />
      </Container>
    </div>
  );
};

export default Home;
