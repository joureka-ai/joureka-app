import React, {useEffect, useState} from "react";
import RecordingOverviewCard from "./RecordingOverviewCard";
import {useRouter} from "next/router";
import {projectService} from "../../services";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";

const RecordingsOverview = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [recordings, setRecordings] = useState(null);

  useEffect(() => {
    projectService.getAllDocuments(pid).then(recordings => setRecordings(recordings));
  }, []);

  return (
    <React.Fragment>
      {!recordings && <LoadingSpinnerOverlay text={"Audiodateien werden geladen!"}/> }
   <div className="d-flex flex-row flex-wrap justify-content-center">
     {recordings && recordings.map(recording => (
       <RecordingOverviewCard recording={recording} key={recording.id}/>
     ))}
     {recordings && recordings.length === 0 &&
     <div className="d-flex justify-content-center align-items-center vh-80 flex-column">
       <h5>Sie haben kein Aufnahmen hochgeladen!</h5>
       <button className="custom-button custom-button-sm custom-button-blue">
         Aufnahme hinzufügen
       </button>
     </div>
     }
   </div>
    </React.Fragment>
  )
};

export default RecordingsOverview;
