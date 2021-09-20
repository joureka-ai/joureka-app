import React from "react";

const LoadingSpinner = ({ beingLoaded, small }) => {

  return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className={`spinner-border text-secondary loading-spinner${small ? "small" : ""}`} role="status">
        </div>
        <p className="text-center pt-3">{beingLoaded} werden geladen! <br/>Bitte haben Sie ein Moment Geduld.</p>
      </div>);
};

export default LoadingSpinner;

