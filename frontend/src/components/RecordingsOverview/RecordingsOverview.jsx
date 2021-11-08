import React, {useEffect, useState} from "react";
import RecordingOverviewBar from "./RecordingOverviewBar";
import {useRouter} from "next/router";
import {projectService} from "../../services";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

const RecordingsOverview = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [recordings, setRecordings] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);

  const pageRecordings = getPageData(recordings, pageIndex);

  useEffect(() => {
    projectService.getAllDocuments(pid).then((recordings) => {
      setRecordings(recordings)
    });
    let interval = setInterval(function(){ 
      projectService.getAllDocuments(pid).then((recordings) => {
        setRecordings(recordings)
      });
    }, 30000);
    return () => {
      clearInterval(interval)
    };
  }, []);

  return (
    <React.Fragment>
      {!recordings && <LoadingSpinnerOverlay text={"Audiodateien werden geladen!"}/> }
      {recordings && pageRecordings.map(recording => (
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
      {recordings && <div
        className={`d-flex flex-row pt-4 ${!showPrevArrow(pageIndex) ? 'justify-content-end' : 'justify-content-between'}`}>
        {showPrevArrow(pageIndex) &&
        <button onClick={() => setPageIndex(pageIndex - 1)} className="icon-button-round mx-2">
          <FontAwesomeIcon icon={faChevronLeft}/></button>}
        {showNextArrow(pageIndex, recordings) &&
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
