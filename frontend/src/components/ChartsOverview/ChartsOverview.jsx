import React, {useState} from "react";
import BubbleChartCard from "../Charts/BubbleChart/BubbleChartCard";
import WordcloudCard from "../Charts/Wordcloud/WordcloudCard";
import StatisticsChartCard from "../Charts/StatisticsChart/StatisticsChartCard";
import TopicChartCard from "../Charts/TopicChart/TopicChartCard";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { projectService } from "../../services";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";


const ChartsOverview = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [loadingRecordings, setLoadingRecordings] = useState(false);
  const [hideCharts, setHideCharts] = useState(true);

  useEffect(() => {
    setLoadingRecordings(true);
    let transcriptionExist = true;
    projectService.getAllDocuments(pid).then((recs) => {
        if(recs.length > 0) {
            for(let i = 0; i < recs.length; i++) {
                if(recs[i].words.length == 0) {
                  transcriptionExist = false;
                  break;
                }
              }
            setHideCharts(!transcriptionExist);
        }
        setLoadingRecordings(false);
    });
  }, []);

  return (
    <React.Fragment>
        {loadingRecordings && <LoadingSpinnerOverlay text={"Grafiken werden erstellt!"}/> }
        <div className="d-flex flex-column justify-content-center align-items-center">
          {!hideCharts && <div className="d-flex flex-column justify-content-center align-items-center full-width">
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
          {hideCharts && !loadingRecordings && <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FontAwesomeIcon icon={faInfoCircle} />
            <div className="px-3">
              <small>
              Sobald alle Aufnahmen transkribiert sind, kannst Du zurückkommen und dir deren statistische Analyse ansehen.
              </small>
            </div>
          </div>}
        </div>
    </React.Fragment>
    
  )
};

function recordingTranscriptionDone(recordings) {
  console.log(recordings)
  let status;
  let done = true;
  for(let i = 0; i < recordings.length; i++) {
    if(recordings[i].fulltext != null) {
      done = true;
      break;
    } else {
      done = false;
    }
  }
  return done;
}

export default ChartsOverview;
