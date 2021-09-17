import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <form action="/" method="get">
    <div className="input-group">
      <input
        value={searchQuery}
        onInput={e => setSearchQuery(e.target.value)}
        type="text"
        id="header-search"
        placeholder="Projekte durchsuchen"
        name="s"
        className="form-control custom-input"
        aria-label="Username"
        aria-describedby="search-icon-addon"
      />
      <span className="input-group-text " id="search-icon-addon"><FontAwesomeIcon icon={faSearch} /></span>
    </div>
  </form>
);

export default SearchBar;
