import React, { useState } from "react";
import styles from "./homeSearch.module.css";
import Link from "next/link";

const HomeSearch = () => {
  const [search, setSearch] = useState(null);

  const {
    searchContainer,
    searchSection,
    title,
    searchInput,
    searchBtnContainer,
    searchBtn,
  } = styles;

  const onChangeHandler = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyPress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      document.getElementById("search").click();
    }
  };

  return (
    <main className={searchContainer}>
      <section className={searchSection}>
        <h1 className={title}>SoundQuest</h1>
        <input
          className={searchInput}
          type="text"
          placeholder="Search SoundQuest"
          onChange={onChangeHandler}
          onKeyDown={handleKeyPress}
        />
        <div className={searchBtnContainer}>
          <Link href={`/search?title=${search}`}>
            <button id="search" className={searchBtn}>
              Go!
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomeSearch;
