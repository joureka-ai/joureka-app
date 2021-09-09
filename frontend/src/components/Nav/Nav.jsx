import Link from "next/link";

import styles from "./Nav.module.css";

const Nav = () => {
  const {
    navContainer,
    listItemContainer,
    listItem,
    linkItem,
    logInContainer,
    logInBtn,
  } = styles;

  const pages = ["Home"];

  const linkItems = pages.map((name) => {
    let link;

    if (name === "Home") {
      link = "/";
    } else {
      link = `/${name}`;
    }

    return (
      <Link href={`${link}`} className={linkItem}>
        <li className={listItem}>{`${name}`}</li>
      </Link>
    );
  });

  return (
    <nav className={navContainer}>
      <ul className={listItemContainer}>{linkItems}</ul>
      <div className={logInContainer}>
        <button className={logInBtn}>Log-In</button>
      </div>
    </nav>
  );
};

export default Nav;
