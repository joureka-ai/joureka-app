import React from "react";

const LoadingSpinner = ({ beingLoaded }) => {

  return (
    <div>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="spinner-border text-secondary loading-spinner" role="status">
        </div>
        <p className="text-center pt-3">{beingLoaded} werden geladen! <br/>Bitte haben Sie ein Moment Geduld.</p>
      </div>
    </div>);
};

export default LoadingSpinner;

