import React from "react";
import RecordingOverviewCard from "./RecordingOverviewCard";
import {useGetRecordingsForProject} from "../../useRequest";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import {useRouter} from "next/router";

const RecordingsOverview = () => {
  const router = useRouter();
  const { pid } = router.query;
  let { recordings, error } = useGetRecordingsForProject(pid);

  if (error) return <div>failed to load</div>;
  if (!recordings) return <LoadingSpinner beingLoaded={"Dateien"}/>;

  return (
   <div className="d-flex flex-row flex-wrap justify-content-center">
     {recordings.map(recording => (
       <RecordingOverviewCard recording={recording} key={recording.id}/>
     ))}
     {recordings.length === 0 &&
     <div className="d-flex justify-content-center align-items-center vh-80 flex-column">
       <h5>Sie haben kein Aufnahmen hochgeladen!</h5>
       <button className="custom-button custom-button-sm custom-button-blue">
         Aufnahme hinzufügen
       </button>
     </div>
     }
   </div>
  )
};

export default RecordingsOverview;
