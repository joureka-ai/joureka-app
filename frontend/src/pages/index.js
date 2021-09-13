import Head from "next/head";
import Container from "@material-ui/core/Container";
import React from "react";
import DeleteIcon from '@material-ui/icons/Delete';
import {userService} from "../services";


const Home = () => {

  function logout() {
    userService.logout();
  }
  return (
    <div>
      <Head>
        <title>joureka</title>
      </Head>
      <Container maxWidth={"md"}>
        <h1>Home - Mein Arbeitsplatz</h1>
        <button onClick={logout}>Log OUT</button>
        <DeleteIcon />
      </Container>
    </div>
  );
};

export default Home;
