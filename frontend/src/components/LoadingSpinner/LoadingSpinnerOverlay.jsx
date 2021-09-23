import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingSpinnerOverlay = ({ text, small }) => {

  return (
    <div className="overlay">
      <LoadingSpinner text={text} small={small}/>
    </div>);
};

export default LoadingSpinnerOverlay;

