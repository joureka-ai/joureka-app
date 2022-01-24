import React, {useState} from "react";
import styles from "./Tabs.module.scss";
import RecordingsOverview from "../RecordingsOverview/RecordingsOverview";
import BubbleChartCard from "../Charts/BubbleChart/BubbleChartCard";
import WordcloudCard from "../Charts/Wordcloud/WordcloudCard";
import StatisticsChartCard from "../Charts/StatisticsChart/StatisticsChartCard";
import TopicChartCard from "../Charts/TopicChart/TopicChartCard";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { projectService } from "../../services";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";


const Tabs = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [recordings, setRecordings] = useState(null);
  const { tabHeader, tabContainer, tabBody, tab, inactive} = styles;
  const [activeTab, setActiveTab] = useState(1);
  const [noStatsTab, setNoStatsTab] = useState(false);

  useEffect(() => {
    let isMounted = true;
    projectService.getAllDocuments(pid).then((recs) => {
      if (isMounted) {
        setRecordings(recs);
        setNoStatsTab(!recordingTranscriptionDone(recs))
      }
    });
    let interval = setInterval(function(){ 
      projectService.getAllDocuments(pid).then((recs) => {
        if (isMounted) {
          setRecordings(recs);
          setNoStatsTab(!recordingTranscriptionDone(recs))
        }
      });
    }, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval)
    };
  }, []); 

  function setCurrentTab(tabIndex) {
    setActiveTab(tabIndex);
  }

  function updateRecordings() {
    projectService.getAllDocuments(pid).then((recs) => {
      setRecordings(recs)
    });
  }

  return (
    <React.Fragment>
      {!recordings && <LoadingSpinnerOverlay text={"Audiodateien werden geladen!"}/> }
      <div className={tabContainer}>
      <div className={tabHeader}>
        <div className={`${tab} ${activeTab === 2 ? inactive: ""}`} onClick={() => setCurrentTab(1)}>
          Aufnahmenübersicht
        </div>
        <div className={`${tab} ${activeTab === 1 ? inactive: ""}`} onClick={() => setCurrentTab(2)}>
          Statistische Auswertung
        </div>
      </div>
      <div className={tabBody}>
        {activeTab === 1 && recordings && <RecordingsOverview onDeleteRecording={updateRecordings} recs={recordings}/>}
        {activeTab === 2 && 
        <div className="d-flex flex-column justify-content-center align-items-center">
          {!noStatsTab && <div className="d-flex flex-column justify-content-center align-items-center full-width">
            <div className="full-width">
              <TopicChartCard></TopicChartCard>
            </div>
            <div className="d-flex flex-column flex-xl-row align-center justify-content-between full-width">
              <WordcloudCard></WordcloudCard>
              <BubbleChartCard></BubbleChartCard>
            </div> 
            <div>
              <StatisticsChartCard></StatisticsChartCard>
            </div>
          </div>}
          {noStatsTab && <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FontAwesomeIcon icon={faInfoCircle} />
            <div className="px-3">
              <small>
              Sobald alle Aufnahmen transkribiert sind, können Sie zurückkommen und sich deren statistische Analyse ansehen.
              </small>
            </div>
          </div>}
        </div>}
      </div>
      <style jsx>{`
        .custom-card {
          width: 400px;
        }
        .custom-card-body {
          height: 350px;
         
        }
      `}</style>
      </div>
    </React.Fragment>
    
  )
};

function recordingTranscriptionDone(recordings) {
  let done = true;
  for(let i = 0; i < recordings.length; i++) {
    if(recordings[i].fulltext == null) {
      done = false;
      break;
    } else {
      done = true;
    }
  }
  return done;
}

export default Tabs;
