import React, {useEffect, useState} from "react";
import RecordingOverviewBar from "./RecordingOverviewBar";
import {useRouter} from "next/router";
import {projectService} from "../../services";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";

const RecordingsOverview = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [recordings, setRecordings] = useState(null);

  useEffect(() => {
    projectService.getAllDocuments(pid).then((recordings) => {
      setRecordings(recordings)
    });
    setInterval(function(){ 
      projectService.getAllDocuments(pid).then((recordings) => {
        setRecordings(recordings)
      });
    }, 30000);
  }, []);

  return (
    <React.Fragment>
      {!recordings && <LoadingSpinnerOverlay text={"Audiodateien werden geladen!"}/> }
   <div className="">
     {recordings && recordings.map(recording => (
       <RecordingOverviewBar recording={recording} key={recording.id}/>
     ))}
     {recordings && recordings.length === 0 &&
     <div className="d-flex justify-content-center align-items-center vh-80 flex-column">
       <h5>Sie haben kein Aufnahmen hochgeladen!</h5>
       <button onClick={() => router.push({pathname: `/project/${pid}/update`, query: {step: 2}})} className="custom-button custom-button-sm custom-button-blue">
         Aufnahme hinzufügen
       </button>
     </div>
     }
   </div>
    </React.Fragment>
  )
};

export default RecordingsOverview;
