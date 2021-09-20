import React from "react";
import Link from "next/link";

const RecordingOverviewCard = ({recording}) => {
  console.log(recording);
  return (
    <div className="custom-card">
      <div className="custom-card-header">
        <div className="custom-card-title">{recording.title}</div>
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
        <Link href={`/project/${recording.fk_project}/recording/${recording.id}`} className="disabled-link">
          <button className="custom-button custom-button-sm custom-button-orange">
            Zur Aufnahme
          </button>
        </Link>
      </div>
    </div>
  )
};

export default RecordingOverviewCard;
