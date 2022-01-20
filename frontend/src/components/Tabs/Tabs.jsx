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


const Tabs = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [recordings, setRecordings] = useState(null);
  const { tabHeader, tabContainer, tabBody, tab, inactive} = styles;
  const [activeTab, setActiveTab] = useState(1);
  const [noStatsTab, setNoStatsTab] = useState(false);

  useEffect(() => {
    projectService.getAllDocuments(pid).then((recs) => {
      setRecordings(recs);
      setNoStatsTab(false);
      for(let i = 0; i < recs.length; i++) {
        if(recs[i].fulltext == null) {
          setNoStatsTab(true);
        }
      }
    });
    let interval = setInterval(function(){ 
      projectService.getAllDocuments(pid).then((recs) => {
        setRecordings(recs);
        setNoStatsTab(false);
        for(let i = 0; i < recs.length; i++) {
          if(recs[i].fulltext == null) {
            setNoStatsTab(true);
          }
        }
      });
    }, 30000);
    return () => {
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
        {!noStatsTab && <div className={`${tab} ${activeTab === 1 ? inactive: ""}`} onClick={() => setCurrentTab(2)}>
          Statistische Auswertung
        </div>}
        {noStatsTab && <div className={`${tab} ${activeTab === 1 ? inactive: ""}`}></div>}
      </div>
      <div className={tabBody}>
        {activeTab === 1 && recordings && <RecordingsOverview onDeleteRecording={updateRecordings} recs={recordings}/>}
        {activeTab === 2 && 
        <div className="d-flex flex-column justify-content-center align-items-center">
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

export default Tabs;
