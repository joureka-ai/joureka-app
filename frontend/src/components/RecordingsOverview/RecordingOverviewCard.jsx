import React from "react";

const RecordingOverviewCard = () => {
  return (
    <div className="custom-card">
      <div className="custom-card-header">
        <div className="custom-card-title">Aufnahme 1</div>
      </div>
      <div className="custom-card-body">
        <div className="d-flex flex-row justify-content-between">
          <span>Länge der Aufnahme:</span>
          <span>00:34:43</span>
        </div>
        <div className="d-flex flex-row justify-content-between">
          <span>Anzahl der Wörter:</span>
          <span>342</span>
        </div>
      </div>
      <div className="custom-card-action">
        <button className="custom-button custom-button-sm custom-button-orange">
          Zur Aufnahme
        </button>
      </div>
    </div>
  )
};

export default RecordingOverviewCard;
