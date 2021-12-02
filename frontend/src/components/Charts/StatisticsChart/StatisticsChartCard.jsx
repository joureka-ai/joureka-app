import { faBuilding, faCalendar, faMapMarkedAlt, faUsers } from "@fortawesome/free-solid-svg-icons";
import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PackChart from "./PackChart";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";


const placesData = [
  {name: "Berlin",frequency: 5},{name: "München",frequency: 10},{name: "Frankfurt",frequency: 20},
  {name: "Beijing",frequency: 7},{name: "Paris",frequency: 20}, {name: "Madrid",frequency: 14},
  {name: "Berlin",frequency: 5},{name: "München",frequency: 10},{name: "Frankfurt",frequency: 17},
  {name: "Beijing",frequency: 7},{name: "Paris",frequency: 20}, {name: "Madrid",frequency: 9},
  {name: "Berlin",frequency: 4},{name: "München",frequency: 14},{name: "Frankfurt",frequency: 10},
  {name: "Beijing",frequency: 7},{name: "Paris",frequency: 19}, {name: "Madrid",frequency: 6},
  {name: "Berlin",frequency: 6},{name: "München",frequency: 7},{name: "Frankfurt",frequency: 2},
  {name: "Beijing",frequency: 1},{name: "Paris",frequency: 1}, {name: "Madrid",frequency: 2},
]

const peopleData = [
  {name: "Angela Merkel",frequency: 5},{name: "Donald Trump",frequency: 10},{name: "Joe Biden",frequency: 20},
  {name: "Joe Biden",frequency: 7},{name: "Angela Merkel",frequency: 20}, {name: "Angela Merkel",frequency: 14},
  {name: "Angela Merkel",frequency: 5},{name: "Joe Biden",frequency: 10},{name: "Donald Trump",frequency: 17},
  {name: "Donald Trump",frequency: 7},
]

const orgData = [
  {name: "TU Berlin",frequency: 5},{name: "Apple",frequency: 10},{name: "IBM",frequency: 20},
  {name: "Apple",frequency: 7},{name: "Organisation",frequency: 20}, {name: "Organisation",frequency: 14},
  {name: "Organisation",frequency: 5},{name: "Organisation",frequency: 10},{name: "Organisation",frequency: 17},
]

const datesData = [
  {name: "January",frequency: 5},{name: "February",frequency: 10},{name: "01.12.2021",frequency: 20},
  {name: "12.Nov.96",frequency: 7},{name: "March",frequency: 20}, {name: "April 2018",frequency: 14},
]

const StatisticsChartCard = () => {
  const [showPlacesChart, setShowPlacesChart] = useState(true);
  const [showPeopleChart, setShowPeopleChart] = useState(false);
  const [showOrganisationsChart, setShowOrganisationsChart] = useState(false);
  const [showDatesChart, setShowDatesChart] = useState(false);

 
  useEffect(() => {
   
  }, []);

  const hideAllCharts = () => {
    setShowPlacesChart(false);
    setShowPeopleChart(false);
    setShowOrganisationsChart(false);
    setShowDatesChart(false);
  }

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
            <button className={`${showPlacesChart ? "active": ""} custom-button custom-button-blue mx-1`} onClick={() => {hideAllCharts(); setShowPlacesChart(!showPlacesChart)}}>
              <FontAwesomeIcon icon={faMapMarkedAlt}/>
              <span className="px-1">Orte:</span>
              <span>{placesData.length}</span>
            </button>
            <button className={`${showPeopleChart ? "active": ""} custom-button custom-button-blue mx-1`} onClick={() => {hideAllCharts(); setShowPeopleChart(!showPeopleChart)}}>
              <FontAwesomeIcon icon={faUsers}/> 
              <span className="px-1">Personen:</span>
              <span>{peopleData.length}</span>
            </button>
            <button className={`${showOrganisationsChart ? "active": ""} custom-button custom-button-blue mx-1`} onClick={() => {hideAllCharts(); setShowOrganisationsChart(!showOrganisationsChart)}}>
              <FontAwesomeIcon icon={faBuilding}/>
              <span className="px-1">Organisationen:</span>
              <span>{orgData.length}</span>
            </button>
            <button className={`${showDatesChart ? "active": ""} custom-button custom-button-blue mx-1`} onClick={() => {hideAllCharts(); setShowDatesChart(!showDatesChart)}}>
              <FontAwesomeIcon icon={faCalendar}/>
              <span className="px-1">Daten:</span>
              <span>{datesData.length}</span>
            </button>
          </div>
          {showPlacesChart && <div className="vh-70">
            <ParentSize>{({ width, height }) => <PackChart width={width} height={height} data={placesData} polygonSides={8} polygonRotation={0} colorScheme={1}/>}</ParentSize>
          </div>}
          {showPeopleChart && <div className="vh-70">
            <ParentSize>{({ width, height }) => <PackChart width={width} height={height} data={peopleData} polygonSides={4} polygonRotation={45} colorScheme={0}/>}</ParentSize>
          </div>}
          {showOrganisationsChart && <div className="vh-70">
            <ParentSize>{({ width, height }) => <PackChart width={width} height={height} data={orgData} polygonSides={6} polygonRotation={0} colorScheme={1}/>}</ParentSize>
          </div>}
          {showDatesChart && <div className="vh-70">
            <ParentSize>{({ width, height }) => <PackChart width={width} height={height} data={datesData} polygonSides={4} polygonRotation={0} colorScheme={0}/>}</ParentSize>
          </div>}
        </div>
    </div>
  )
};

export default StatisticsChartCard;
