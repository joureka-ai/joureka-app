import React from "react";
import Link from "next/link";
import styles from "./recordingOverviewBar.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";


const RecordingOverviewBar = ({recording}) => {
  const {recordingBar, loader, loaderBar, success, inactive} = styles;
  console.log(recording.id)
  return (
    <div className={`${recordingBar} ${ recording.words.length != 0 ? success : inactive}`}>
      <span>{recording.title}</span>
      <div className="d-flex ali">
        <button className="icon-button-transparent icon-gray mx-4" onClick={(e) => removeFiles(e, index)}>
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
  </div>
  )
};

export default RecordingOverviewBar;
