import React, {useState} from "react";
import { ParentSize } from "@visx/responsive";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faChevronUp, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import TopicNetworkChart from "./TopicNetworkChart";
import TopicStackedBarChart from "./TopicStackedBarChart";

const data = [
  { frequency: 11, name: "Auto", reference: 15 },
  { frequency: 12, name: "VW", reference: 12 },
  { frequency: 13, name: "Lenkrad", reference: 23 },
  { frequency: 23, name: "LKW", reference: 26 },
  { frequency: 5, name: "Zug", reference: 6 },
  { frequency: 17, name: "ICE", reference: 20 },
  { frequency: 4, name: "Bus", reference: 8 },
  { frequency: 20, name: "Flughzeug", reference: 20 },
  { frequency: 15, name: "Boot", reference: 20 },
  { frequency: 13, name: "Fahrrad", reference: 30 },
  { frequency: 17, name: "U-Boot", reference: 25 },
];

const TopicChartCard = () => {
  const [activeChart, setActiveChart] = useState(1)

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
            {activeChart == 2 && <button className="icon-button-transparent icon-orange mx-2" onClick={() => setActiveChart(1)}>
              <FontAwesomeIcon size="lg" icon={faChevronLeft} />
            </button>}
            {activeChart == 1 && <ParentSize>{({ width, height }) => <TopicNetworkChart width={width} height={height} words={data} topic={"Topic 1"}/>}</ParentSize>}
            {activeChart == 2 && <ParentSize>{({ width, height }) => <TopicStackedBarChart width={width} height={height} words={data} topic={"Topic 1"}/>}</ParentSize>}
            {activeChart == 1 && <button className="icon-button-transparent icon-orange mx-2" onClick={() => setActiveChart(2)}>
              <FontAwesomeIcon size="lg" icon={faChevronRight} />
            </button>}
        </div>
        <style jsx>{`
            .custom-card-body {
              height: 500px;
            }
        `}</style>
    </div>
  )
};

export default TopicChartCard;
