import React, {useState, useEffect} from "react";
import { useRouter } from "next/router";
import { ParentSize } from "@visx/responsive";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faChevronUp, faInfo, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import TopicNetworkChart from "./TopicNetworkChart";
import TopicStackedBarChart from "./TopicStackedBarChart";
import IntertopicDistanceMap from "./IntertopicDistanceMap";
import { chartsDataService } from "../../../services/chartsData.service";
import { projectService } from "../../../services/project.service";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const NR_OF_WORDS_TOPICS = 5;
const NR_OF_RECORDING_NEEDED = 5; 

const TopicChartCard = () => {
  const [activeChart, setActiveChart] = useState(1)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const router = useRouter();
  const { pid } = router.query;
  const [topics, setTopics] = useState(null);
  const [sufficientRecordings, setSufficientRecodings] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    projectService.getAllDocuments(pid).then((docs) => {
      if(docs.length >= NR_OF_RECORDING_NEEDED) {
        setSufficientRecodings(true)
        chartsDataService.getTopics(pid, NR_OF_WORDS_TOPICS).then((t) => {
          setTopics(t);
          setLoadingData(false);
        });
      } else {
        setSufficientRecodings(false);
        setLoadingData(false);
      }
    })
    
  }, []);

  function setTopic(topic) {
    setSelectedTopic(topic)
    setActiveChart(2)
  }

  function navigateToPreviousChart() {
    if(activeChart == 3) {
      setActiveChart(2)
    } else {
      setActiveChart(1)
      setSelectedTopic(null)
      chartsDataService.getTopics(pid, NR_OF_WORDS_TOPICS).then((t) => {
        setTopics(t);
      });
    } 
  }

  return (
    <div className="custom-card full-width">
        <div className="custom-card-header">
          <div className="custom-card-title">
            <span>Automatisch erkannte Themengebiete</span>
            <div className={`d-inline-block custom-tooltip`}>
              <button className="icon-button-transparent icon-orange mx-2">
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
                {<span className="tooltiptext">Diese Grafik visualisiert für Dich die algorithmische erstellten Themen. 
                Dabei handelt es sich um eine Methode, mit der alle Wörter in allen Transkripten eines Projektes in Gruppen 
                geordnet werden, die sich wahrscheinlich auf ein ähnliches Thema beziehen. Der Algorithmus zählt hierfür unter 
                anderem die Häufigkeit von Wörtern in jedem Dokument und im gesamten Projekt. Da Topic Modelling eine sogenannte 
                unüberwachte (unsupervised) Methode ist, wird für jedes deiner Projekte ein eigenes Modell trainiert. 
                Als Ergebnis beschreibt der Algorithmus ein Themengebiet anhand der Wörter, welcher er am einflussreichsten einschätzt. 
                Klicke auf die Mitte eines Diagramms, um dem Thema einen Namen zu geben.</span>}
            </div>
          </div>
        </div>
        {loadingData && <div className="custom-card-body d-flex flex-row justify-content-center"><LoadingSpinner text={"Grafik wird erstellt."}/></div>}
        {!loadingData && sufficientRecordings && <div className="custom-card-body d-flex flex-row justify-content-center">
            {activeChart == 2  && <button className="icon-button-transparent icon-orange mx-2" onClick={navigateToPreviousChart}>
              <FontAwesomeIcon size="lg" icon={faChevronLeft} />
            </button>}
            {activeChart == 1 && topics && !selectedTopic && <ParentSize>{({ width, height }) => <IntertopicDistanceMap width={width} height={height} topics={topics}  setSelectedTopic={setTopic}/>}</ParentSize>}
            {activeChart == 2 && selectedTopic && <ParentSize>{({ width, height }) => <TopicNetworkChart width={width} height={height} topic={selectedTopic}/>}</ParentSize>}
            {/*activeChart == 3 && selectedTopic && <ParentSize>{({ width, height }) => <TopicStackedBarChart width={width} height={height} words={data} topic={selectedTopic}/>}</ParentSize>*/}
            {/*activeChart == 2 && <button className="icon-button-transparent icon-orange mx-2" onClick={() => setActiveChart(3)}>
              <FontAwesomeIcon size="lg" icon={faChevronRight} />
  </button>*/}
        </div>}
        {!loadingData && !sufficientRecordings && <div className="custom-card-body custom-card-body-no-content d-flex flex-row justify-content-center">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FontAwesomeIcon icon={faInfoCircle} />
            <div className="px-3">
              <small>
                Der hier verwendete Algorithmus - Topic Modelling - ist für größere Sammlung an Texten konzipiert. Im Optimalfall beinhaltet daher ein Projekt mehr als 100 unterschiedliche Aufnahmen und jedes Dokument beinhaltet mehrere hunderte Wörter. 
                Für den Fall, das ein Projekt weniger als 100 Aufnahmen enthält, werden die Aufnahmen künstlich dupliziert, um eine grundlegende Funktionalität gewährleisten zu können. Das absolute Minimum für das Ausführen dieser Funkionalität liegt bei mindestens 20 unterschiedlichen Aufnahmen mit jeweils mehreren hunderten Wörter!
              </small>
            </div>
          </div>
        </div>}
        <style jsx>{`
            .custom-card-body {
              height: 500px;
            }
            .custom-card-body-no-content {
              height: 250px;
              overflow-y: scroll;
            }
        `}</style>
    </div>
  )
};

export default TopicChartCard;
