import React, { useState } from "react";
import { useRouter, Router } from "next/router";

import RenderData from "./RenderData";

import styles from "./searchResult.module.css";

const SearchResult = () => {
  const Router = useRouter();

  const { searchContainer, searchMain, searchBtn, searchInput } = styles;

  const [search, setSearch] = useState(Router.query.title);
  const [value, setValue] = useState(Router.query.title);

  const updateQuery = (newQuery) => {
    Router.push({
      pathname: "/search",
      query: { title: encodeURI(newQuery) },
    });
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue(search);
    updateQuery(search);
  };

  return (
    <form onSubmit={handleSubmit} className={searchContainer}>
      <div className={searchMain}>
        <input
          className={searchInput}
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="search"
        />
        <button className={searchBtn}>Go!</button>
        {value && <RenderData value={value} />}
      </div>
    </form>
  );
};

SearchResult.getInitialProps = async (context) => {
  console.log(context.query);
  return { Router };
};

export default SearchResult;
