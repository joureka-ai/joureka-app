import React, {useEffect, useState} from "react";
import { ParentSize } from "@visx/responsive";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronUp, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { chartsDataService } from "../../../services/chartsData.service";
import { useRouter } from "next/router";
import BubbleChart from "./BubbleChart";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";


const BubbleChartCard = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [selectedAnnotation, setSelectedAnnotation] = useState({});
  const [pins, setPins] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    chartsDataService.getPinPlotData(pid).then((p) => {
      setPins(p.annots)
      chartsDataService.getTopicPlotData(pid).then((t) => {
        setTopics(t.annots)
        setLoadingData(false)
      });
    });
    /*chartsDataService.getTopicPlotData(pid).then((t) => {
      setTopics(t.topics)
    };*/
  }, []);

  return (
    <div className="custom-card full-width">
        <div className="custom-card-header">
          <div className="custom-card-title">
            <span>Annotierte Themengebiete</span>
            <div className={`d-inline-block custom-tooltip`}>
              <button className="icon-button-transparent icon-orange mx-2">
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
                {<span className="tooltiptext">Diese Grafik zeigt die Themen (und Pins), die Du selbst in den Aufnahmen 
                annotiert hast. Die Größe der Kreise spiegelt hierbei die Häufigkeit des Themas wieder. Du kannst die 
                Themen per Drag & Drop nach deinen Vorstellungen anordnen. 
                Klicke auf einen Kreis, um eine Liste der Aufnahmen zu sehen, in denen Du das Thema markiert hast.</span>}
              </div>
          </div>
        </div>
        <div className="custom-card-body d-flex justify-content-center">
          {loadingData && <LoadingSpinner text={"Grafik wird erstellt."}/>}
          {!loadingData && pins && topics && <ParentSize>{({ width, height }) => <BubbleChart width={width} height={height} pins={pins} topics={topics} setSelectedAnnotation={setSelectedAnnotation}/>}</ParentSize>}
          {!loadingData && !pins && !topics &&  <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FontAwesomeIcon icon={faInfoCircle} />
            <div className="px-3">
              <small>
              Es wurden noch keine Pins und Themengebiete in der Aufnahmen annotiert.
              </small>
            </div>
          </div>}
        </div>
        {selectedAnnotation.documents && <div>
          <div className="pb-3 d-flex justify-content-between">
            <span>Thema/Pin <b>{selectedAnnotation.text}</b> kommt in folgenden Aufnahmen vor</span>
            <button onClick={() => setSelectedAnnotation({})} className="icon-button-transparent icon-blue mx-2">
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
          <div className="chart-recordings-list">{
            selectedAnnotation.documents.map((doc, index) => (
              <div key={index} className="p-1 d-flex justify-content-between">
                <span className="fw-bolder">{doc.title}</span>
                <button onClick={() => router.push(`/project/${pid}/recording/${doc.id}`)} className="custom-button custom-button-sm custom-button-blue">Zur Aufnahme</button>
              </div>
            ))
          }</div>
        </div> }
        <style jsx>{`
            .custom-card-body {
              height: 350px;
            }
            .custom-card-body-no-content {
              height: 200px;
            }
        `}</style>
    </div>
  )
};

export default BubbleChartCard;
