import styles from "./layout.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {

  return (
    <div>
      <Header/>
      <div className={styles.mainContainer}>{children}</div>
      <Footer/>
    </div>
  );
};

export default Layout;
