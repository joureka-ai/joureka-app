import React, {useState, useEffect} from "react";
import Link from "next/link";
import styles from "./recordingOverviewBar.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRedo, faTrash} from "@fortawesome/free-solid-svg-icons";
import { projectService } from "../../services/project.service";
import Modal from "../Modal/Modal";
import { useRouter } from "next/router";


const RecordingOverviewBar = ({recording, onRecordingDeleted}) => {
  const router = useRouter();
  const { pid } = router.query;
  const {recordingBar, loader, loaderBar, success, inactive, failed} = styles;
  const [showingDocumentDeleteModal, setShowingDocumentDeleteModal] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusClass, setStatusClass] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      projectService.getTranscriptionJobStatus(pid, recording.id, recording.task_id).then(status => {
        setStatus(status)
        if(status == 'SUCCESS') setStatusClass(success);
        else if(status == 'PENDING' || status == "STARTED" || status == "RETRY") setStatusClass(inactive);
        else if(status == 'FAILED') setStatusClass(failed);
      });
    };
    return () => {
      isMounted = false;
    };
  }, [recording]); 

  
  function removeRecording() {
    projectService.deleteDocument(recording.fk_project, recording.id).then(() => {
      setShowingDocumentDeleteModal(false)
      onRecordingDeleted()
    })
  }
  
  function restartTranskriptionJob() {
    projectService.startTranskriptionJob(recording.fk_project, recording.id)
    .then(() => {
      onRecordingDeleted()
    })
    .catch((error) => { 
      if(error.status = 409) {
        console.log("Transcription already exists!")
      } else {
        console.log("Failed to start transcription task!")
      }
    })
  }

  return (
    <React.Fragment>
      {status && <div className={`${recordingBar} ${statusClass}`}>
      <span>{recording.title}</span>
      {status != "FAILED" && <div className="">
        <button className="icon-button-transparent icon-gray mx-4" onClick={() => setShowingDocumentDeleteModal(true)}>
                <FontAwesomeIcon icon={faTrash} />
        </button>
        <Link href={`/project/${recording.fk_project}/recording/${recording.id}`} className="disabled-link">
        <button disabled={(status == "PENDING" || status == "STARTED" || status == "RETRY")} className="custom-button custom-button-sm custom-button-orange">Zum Projekt</button>
        </Link>
      </div>} 
      {status == "FAILED" && <div className="d-flex justify-content-end">
            <span class="badge bg-danger">Etwas ist schief gelaufen! Aufnahme erneut transkribieren.</span>
            <button className="icon-button-transparent icon-red mx-4" onClick={() => restartTranskriptionJob()}>
                  <FontAwesomeIcon icon={faRedo} />
            </button>
      </div>} 
      {(status == "PENDING" || status == "STARTED" || status == "RETRY") && <div className={loader}>
        <div className={loaderBar}>
        </div>
      </div>
      }
        <Modal
        title={"Audiodatei löschen"}
        onClose={() => setShowingDocumentDeleteModal(false)}
        onConfirm={() => removeRecording()}
        show={showingDocumentDeleteModal}
        onCloseButton={"Abbrechen"}
        onConfirmButton={"Löschen"}
      >
        <div>Möchtest Du die ausgewählte Audiodatei wirklich löschen?</div>
      </Modal> 
    </div>}
    </React.Fragment>
   
  )
};

export default RecordingOverviewBar;
