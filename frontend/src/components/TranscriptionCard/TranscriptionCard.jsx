import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faDownload, faEdit } from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import styles from "../../styles/transcription.module.scss"
import { useRouter } from 'next/router'

const TranscriptionCard = ({document}) => {
  const router = useRouter();
  const [inEditMode, setInEditMode] = useState(false);

  return (
  <div className="custom-card">
    <div className="custom-card-header d-flex flex-row justify-content-between">
      <div className="custom-card-title">Transkription</div>
      <div>
        <button className="icon-button-transparent icon-blue mx-2" onClick={() => setInEditMode(true)}>
          <FontAwesomeIcon icon={faEdit} /></button>
        <button className="icon-button-transparent icon-blue mx-2" onClick={() => console.log("Edit")}>
          <FontAwesomeIcon icon={faDownload} /></button>
      </div>
      
    </div>
    <div className="custom-card-body">
      <div className={styles.transcriptionContainer}>
      {!inEditMode && <div className={styles.transcriptionContent}>
        {document.words.map((word, index) =>
          <div key={index} className={`d-inline-block ${word.confidence < 0.5 && word.start_time ? `custom-tooltip ${styles.lowConfidenceWord}` : ""}`}>{word.word}&nbsp;
            {word.confidence < 0.5 && word.start_time && <span className="tooltiptext"> Wort könnten nicht erkannt werden!</span>}
          </div>
        )}
        </div>}
        {inEditMode && <textarea disabled={!inEditMode} value={document.fulltext} type="textarea" rows="100" name="pinDescription"/>}
      </div>
    </div>
    <div className="custom-card-action">
        {inEditMode && <div className="d-flex flex-column flex-md-row justify-content-end align-items-end">
          <button onClick={() => setInEditMode(false)} className="custom-button custom-button-sm custom-button-transparent mx-1">Abbrechen</button>
          <button onClick={() => console.log("Speichern")} className="custom-button custom-button-sm custom-button-blue">Änderungen speichern</button>
          </div>}
    </div>
  </div>
  )
};

export default TranscriptionCard;
