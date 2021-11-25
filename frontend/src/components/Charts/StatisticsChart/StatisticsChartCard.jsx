import { faBuilding, faCalendar, faMapMarkedAlt, faUsers } from "@fortawesome/free-solid-svg-icons";
import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PackChart from "./PackChart";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";


const data = [
  {name: "Berlin",radius: 5},{name: "München",radius: 10},{name: "Frankfurt",radius: 20},
  {name: "Beijing",radius: 7},{name: "Paris",radius: 20}, {name: "Madrid",radius: 14},
  {name: "Berlin",radius: 5},{name: "München",radius: 10},{name: "Frankfurt",radius: 17},
  {name: "Beijing",radius: 7},{name: "Paris",radius: 20}, {name: "Madrid",radius: 9},
  {name: "Berlin",radius: 4},{name: "München",radius: 14},{name: "Frankfurt",radius: 10},
  {name: "Beijing",radius: 7},{name: "Paris",radius: 19}, {name: "Madrid",radius: 6},
  {name: "Berlin",radius: 6},{name: "München",radius: 7},{name: "Frankfurt",radius: 2},
  {name: "Beijing",radius: 1},{name: "Paris",radius: 1}, {name: "Madrid",radius: 2},
]

const StatisticsChartCard = () => {
  const [showPlacesChart, setShowPlacesChart] = useState(false);
 
  useEffect(() => {
   
  }, []);

  return (
    <div className="custom-card vw-60">
        <div className="custom-card-header">
            <div className="custom-card-title">Statistische Analyse</div>
        </div>
        <div className="custom-card-body">
          <div className="d-flex flex-row justify-content-between py-1">
            <span>Anzahl der Aufnahmen:</span>
            <span className="fw-bolder">2</span>
          </div>
          <div className="d-flex flex-row justify-content-between py-1">
            <span>Durchschnittliche Länge der Aufnahmen:</span>
            <span className="fw-bolder">00:34:59</span>
          </div>
          <div className="d-flex flex-row justify-content-between py-1">
            <span>Durchschnittliche Wörteranzahl der Aufnahmen:</span>
            <span className="fw-bolder">2500 Wörter</span>
          </div>
          <div className="d-flex flex-row justify-content-center pt-4 pb-1">
            <button className="custom-button custom-button custom-button-blue mx-1" onClick={() => setShowPlacesChart(!showPlacesChart)}>
              <FontAwesomeIcon icon={faMapMarkedAlt}/>
              <span className="px-1">Orte:</span>
              <span>24</span>
            </button>
            <button className="custom-button custom-button custom-button-blue mx-1">
              <FontAwesomeIcon icon={faUsers}/> 
              <span className="px-1">Personen:</span>
              <span>100</span>
            </button>
            <button className="custom-button custom-button custom-button-blue mx-1">
              <FontAwesomeIcon icon={faBuilding}/>
              <span className="px-1">Organisationen:</span>
              <span>100</span>
            </button>
            <button className="custom-button custom-button custom-button-blue mx-1">
              <FontAwesomeIcon icon={faCalendar}/>
              <span className="px-1">Daten:</span>
              <span>100</span>
            </button>
          </div>
          {showPlacesChart && <div className="vh-70">
            <ParentSize>{({ width, height }) => <PackChart width={width} height={height} data={data} />}</ParentSize>
          </div>}
        </div>
    </div>
  )
};

export default StatisticsChartCard;
