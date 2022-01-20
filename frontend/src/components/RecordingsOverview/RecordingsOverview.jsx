import React, {useEffect, useState} from "react";
import RecordingOverviewBar from "./RecordingOverviewBar";
import {useRouter} from "next/router";
import {projectService} from "../../services";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faPager, faPlus} from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

const RecordingsOverview = ({recs, onDeleteRecording}) => {
  const router = useRouter();
  const { pid } = router.query;
  const [pageIndex, setPageIndex] = useState(0);
  const [pageRecordings, setPageRecordings] = useState([])

  useEffect(() => {
    setPageRecordings(getPageData(recs, pageIndex));
  }, [recs]);

  function recordingDeleted(){
    onDeleteRecording();
  }

  return (
    <React.Fragment>
      <button className="border-button border-button-blue full-width" onClick={() =>  router.push({pathname: `/project/${pid}/update`, query: {step: 2}})}><FontAwesomeIcon icon={faPlus} /><span className="px-3">Aufnahme hinzufügen</span></button>
      {recs && pageRecordings.map(recording => (
        <RecordingOverviewBar onRecordingDeleted={recordingDeleted} recording={recording} key={recording.id}/>
      ))}
      {recs && recs.length === 0 &&
      <div className="d-flex justify-content-center align-items-center vh-80 flex-column">
        <h5 className="text-center">Sie haben kein Aufnahmen hochgeladen!</h5>
      </div>
      }
      {recs && <div
        className={`d-flex flex-row pt-4 ${!showPrevArrow(pageIndex) ? 'justify-content-end' : 'justify-content-between'}`}>
        {showPrevArrow(pageIndex) &&
        <button onClick={() => setPageIndex(pageIndex - 1)} className="icon-button-round mx-2">
          <FontAwesomeIcon icon={faChevronLeft}/></button>}
        {showNextArrow(pageIndex, recs) &&
        <button onClick={() => setPageIndex(pageIndex + 1)} className="icon-button-round mx-2">
          <FontAwesomeIcon icon={faChevronRight}/></button>}
      </div>
      }
    </React.Fragment>
  )
};

const getPageData = (projects, page) => {
  if(projects)  return projects.slice(page*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE+ITEMS_PER_PAGE);
};

const showNextArrow = (currentPageIndex, filteredProjects) => {
  return currentPageIndex < (filteredProjects.length/ITEMS_PER_PAGE) - 1;
};

const showPrevArrow = (currentPageIndex) => {
  return currentPageIndex > 0;
};



export default RecordingsOverview;
