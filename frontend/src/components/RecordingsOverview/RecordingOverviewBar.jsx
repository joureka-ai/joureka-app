import React, {useState} from "react";
import Link from "next/link";
import styles from "./recordingOverviewBar.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import { projectService } from "../../services/project.service";
import Modal from "../Modal/Modal";


const RecordingOverviewBar = ({recording, onRecordingDeleted}) => {
  const {recordingBar, loader, loaderBar, success, inactive} = styles;
  const [showingDocumentDeleteModal, setShowingDocumentDeleteModal] = useState(false);
  
  function removeRecording() {
    projectService.deleteDocument(recording.fk_project, recording.id).then(() => {
      setShowingDocumentDeleteModal(false)
      onRecordingDeleted()
    })
  } 
  return (
    <div className={`${recordingBar} ${ recording.words.length != 0 ? success : inactive}`}>
      <span>{recording.title}</span>
      <div className="">
        <button className="icon-button-transparent icon-gray mx-4" onClick={() => setShowingDocumentDeleteModal(true)}>
                <FontAwesomeIcon icon={faTrash} />
        </button>
        <Link href={`/project/${recording.fk_project}/recording/${recording.id}`} className="disabled-link">
        <button disabled={recording.words.length == 0} className="custom-button custom-button-sm custom-button-orange">Zum Projekt</button>
        </Link>
      </div> 
      {recording.words.length == 0 && <div className={loader}>
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
        <div>Möchten Sie die ausgewählte Audiodatei wirklich löschen?</div>
      </Modal> 
  </div>
  )
};

export default RecordingOverviewBar;
