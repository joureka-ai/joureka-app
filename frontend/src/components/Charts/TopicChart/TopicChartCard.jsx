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

const NR_OF_TOPICS = 3;
const NR_OF_RECORDING_NEEDED = 10; 

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
  const [selectedTopic, setSelectedTopic] = useState(null)
  const router = useRouter();
  const { pid } = router.query;
  const [topics, setTopics] = useState(null);
  const [sufficientRecordings, setSufficientRecodings] = useState(false)

  useEffect(() => {
    projectService.getAllDocuments(pid).then((docs) => {
      if(docs.length >= NR_OF_RECORDING_NEEDED) {
        setSufficientRecodings(true)
        chartsDataService.getTopics(pid, NR_OF_TOPICS).then((t) => {
          setTopics(t);
        });
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
      chartsDataService.getTopics(pid, NR_OF_TOPICS).then((t) => {
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
                {<span className="tooltiptext">Sed a posuere mi, et viverra orci. Fusce in dui et justo gravida egestas. Cras ullamcorper nisi vel bibendum aliquet. Vivamus viverra lacinia justo, eget imperdiet lacus feugiat sed. Aliquam a arcu in orci congue viverra. Aenean sed orci eu urna laoreet imperdiet. Aenean pulvinar massa velit, ac varius sem pharetra vel. Integer gravida placerat suscipit. Sed congue tincidunt arcu, at dapibus mi blandit at. Pellentesque maximus vulputate purus, sed vestibulum urna tristique vel. Nam et bibendum orci, posuere imperdiet velit. Maecenas volutpat tortor nisl, et accumsan felis fermentum eu. In vitae lobortis justo.</span>}
            </div>
          </div>
        </div>
        {sufficientRecordings && <div className="custom-card-body d-flex flex-row justify-content-center">
            {(activeChart == 3 || activeChart == 2)  && <button className="icon-button-transparent icon-orange mx-2" onClick={navigateToPreviousChart}>
              <FontAwesomeIcon size="lg" icon={faChevronLeft} />
            </button>}
            {activeChart == 1 && topics && !selectedTopic && <ParentSize>{({ width, height }) => <IntertopicDistanceMap width={width} height={height} topics={topics}  setSelectedTopic={setTopic}/>}</ParentSize>}
            {activeChart == 2 && selectedTopic && <ParentSize>{({ width, height }) => <TopicNetworkChart width={width} height={height} topic={selectedTopic}/>}</ParentSize>}
            {activeChart == 3 && selectedTopic && <ParentSize>{({ width, height }) => <TopicStackedBarChart width={width} height={height} words={data} topic={selectedTopic}/>}</ParentSize>}
            {activeChart == 2 && <button className="icon-button-transparent icon-orange mx-2" onClick={() => setActiveChart(3)}>
              <FontAwesomeIcon size="lg" icon={faChevronRight} />
            </button>}
        </div>}
        {!sufficientRecordings && <div className="custom-card-body custom-card-body-no-content d-flex flex-row justify-content-center">
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
