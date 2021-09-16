import styles from "./Footer.module.scss";
import React from "react";

const Footer = () => {
  return (
    <div className={`${styles.footerContainer}`}>
      <div className={`${styles.left}`}>
        <div><span>Datenschutz</span> | <span>Impressum</span></div>
      </div>
      <div className={`${styles.right}`}>
        <div className={`${styles.logoContainer}`}>
          <img className="px-3" src="/logo.png" width="100" alt="joureka Logo"/>
          <span>&#169; joureka 2021</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

