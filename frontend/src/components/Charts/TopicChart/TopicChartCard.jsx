import React, {useState} from "react";
import { ParentSize } from "@visx/responsive";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronUp, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import TopicNetworkChart from "./TopicNetworkChart";

const nodes = [
  { frequency: 0.005, name: "Auto", reference: 0.007 },
  { frequency: 0.005, name: "VW", reference: 0.007 },
  { frequency: 0.006, name: "Lenkrad", reference: 0.007 },
  { frequency: 0.007, name: "LKW", reference: 0.007 },
  { frequency: 0.0035, name: "Zug", reference: 0.007 },
  { frequency: 0.0048, name: "ICE", reference: 0.007 },
  { frequency: 0.0055, name: "Bus", reference: 0.007 },
  { frequency: 0.0050, name: "Auto", reference: 0.007 },
  { frequency: 0.0050, name: "VW", reference: 0.007 },
  { frequency: 0.0044, name: "Lenkrad", reference: 0.007 },
  { frequency: 0.0068, name: "LKW", reference: 0.007 },
  { frequency: 0.0039, name: "Zug", reference: 0.007 },
  { frequency: 0.0050, name: "ICE", reference: 0.007 },
  { frequency: 0.0051, name: "Bus", reference: 0.007 },
];

const TopicChartCard = () => {
 

  return (
    <div className="custom-card">
        <div className="custom-card-header">
          <div className="custom-card-title">
            <span>Automatisch erkannte Themengebiete</span>
            <div className={`d-inline-block custom-tooltip`}>
              <button className="icon-button-transparent icon-orange mx-2">
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
                {<span className="tooltiptext">Sed a posuere mi, et viverra orci. Fusce in dui et justo gravida egestas. Cras ullamcorper nisi vel bibendum aliquet. Vivamus viverra lacinia justo, eget imperdiet lacus feugiat sed. Aliquam a arcu in orci congue viverra. Aenean sed orci eu urna laoreet imperdiet. Aenean pulvinar massa velit, ac varius sem pharetra vel. Integer gravida placerat suscipit. Sed congue tincidunt arcu, at dapibus mi blandit at. Pellentesque maximus vulputate purus, sed vestibulum urna tristique vel. Nam et bibendum orci, posuere imperdiet velit. Maecenas volutpat tortor nisl, et accumsan felis fermentum eu. In vitae lobortis justo.</span>}
            </div>
          </div>
        </div>
        <div className="custom-card-body d-flex flex-row justify-content-center">
            {<ParentSize>{({ width, height }) => <TopicNetworkChart width={width} height={height} words={nodes} topic={"Transport"}/>}</ParentSize>}
        </div>
        <style jsx>{`
            .custom-card {
              width: 100%;
            }
            .custom-card-body {
              height: 450px;
            }
        `}</style>
    </div>
  )
};

export default TopicChartCard;
