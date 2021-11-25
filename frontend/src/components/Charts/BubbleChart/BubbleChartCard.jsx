import React, {useState} from "react";
import { ParentSize } from "@visx/responsive";
import DragI from "./BubbleChart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronUp, faInfoCircle } from "@fortawesome/free-solid-svg-icons";


const BubbleChartCard = () => {
  const [selectedAnnotation, setSelectedAnnotation] = useState({});

  return (
    <div className="custom-card">
        <div className="custom-card-header">
          <div className="custom-card-title">
            <span>Annotierte Themengebiete</span>
            <div className={`d-inline-block custom-tooltip`}>
              <button className="icon-button-transparent icon-orange mx-2">
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
                {<span className="tooltiptext">Sed a posuere mi, et viverra orci. Fusce in dui et justo gravida egestas. Cras ullamcorper nisi vel bibendum aliquet. Vivamus viverra lacinia justo, eget imperdiet lacus feugiat sed. Aliquam a arcu in orci congue viverra. Aenean sed orci eu urna laoreet imperdiet. Aenean pulvinar massa velit, ac varius sem pharetra vel. Integer gravida placerat suscipit. Sed congue tincidunt arcu, at dapibus mi blandit at. Pellentesque maximus vulputate purus, sed vestibulum urna tristique vel. Nam et bibendum orci, posuere imperdiet velit. Maecenas volutpat tortor nisl, et accumsan felis fermentum eu. In vitae lobortis justo.</span>}
              </div>
          </div>
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
