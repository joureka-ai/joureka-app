import React, {useState} from "react";
import { ParentSize } from "@visx/responsive";
import DragI from "./BubbleChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";


const BubbleChartCard = () => {
  const [selectedAnnotation, setSelectedAnnotation] = useState({});

  return (
    <div className="custom-card">
        <div className="custom-card-header">
          <div className="custom-card-title">Annotierte Themengebiete</div>
        </div>
        <div className="custom-card-body">
            <ParentSize>{({ width, height }) => <DragI width={width} height={height} setSelectedAnnotation={setSelectedAnnotation}/>}</ParentSize>
        </div>
        {selectedAnnotation.recordingsIds && <div>
          <div className="pb-3 d-flex justify-content-between">
            <span>Thema/Pin <b>{selectedAnnotation.id}</b> kommt in folgenden Aufnahmen vor</span>
            <button onClick={() => setSelectedAnnotation({})} className="icon-button-transparent icon-blue mx-2">
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
          <div className="chart-recordings-list">{
            selectedAnnotation.recordingsIds.map((item, index) => (
              <div key={index} className="p-1 d-flex justify-content-between">
                <span className="fw-bolder">Aufnahme Placeholder {item}</span>
                <button className="custom-button custom-button-sm custom-button-blue">Zur Aufnahme</button>
              </div>
            ))
          }</div>
        </div> }
        <style jsx>{`
            .custom-card {
              width: 100%;
            }
            .custom-card-body {
              height: 350px;
            }
        `}</style>
    </div>
  )
};

export default BubbleChartCard;
