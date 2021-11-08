import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import styles from "./searchBar.module.scss"

const SearchBar = ({ searchQuery, setSearchQuery, placeholder }) => {
  const {searchBar} = styles;

  return (
    <div className={searchBar}>
    <div className="input-group">
      <input
        value={searchQuery}
        onInput={e => setSearchQuery(e.target.value)}
        type="text"
        id="header-search"
        placeholder={placeholder}
        name="s"
        className="form-control custom-input custom-input-blue"
        aria-label="Username"
        aria-describedby="search-icon-addon"
      />
      <span className="input-group-text " id="search-icon-addon"><FontAwesomeIcon icon={faSearch} /></span>
    </div>
  </div>
  )

}

export default SearchBar;
