import Head from "next/head";
import styles from "./layout.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {

  return (
    <div>
      <Head>
        <title>SoundQuest</title>
      </Head>
      <Header/>
      <div className={styles.mainContainer}>{children}</div>
      <Footer/>
    </div>
  );
};

export default Layout;
