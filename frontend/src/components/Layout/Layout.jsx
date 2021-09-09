import Head from "next/head";

import Nav from "../Nav/Nav";

import styles from "./layout.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  const { mainContainer, container } = styles;

  return (
    <div className={mainContainer}>
      <Head>
        <title>SoundQuest</title>
      </Head>
      <Header/>
      <div className={container}>{children}</div>
      <Footer/>
    </div>
  );
};

export default Layout;
