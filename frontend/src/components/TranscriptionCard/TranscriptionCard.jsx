import React, {useEffect, useState} from "react";
import {projectService} from "../../services";
import styles from "../../styles/transcription.module.scss"

const TranscriptionCard = () => {
  let transcription = require("../../../data/trans");

  useEffect(() => {
    //projectService.getDocumentById(pid, rid).then(rec => setRecording(rec));
    //projectService.getFileOfDocument(pid, rid).then(url => setFileUrl(url));
  }, []);

  return (
  <div className="custom-card">
    <div className="custom-card-header">
      <div className="custom-card-title">Transkription</div>
    </div>
    <div className="custom-card-body">
      <p>
        {transcription.words.map((word, index) =>
          <div key={index} className={`d-inline-block ${word.confidence < 0.5 && word.start_time ? `custom-tooltip ${styles.lowConfidenceWord}` : ""}`}>{word.word}&nbsp;
            {word.confidence < 0.5 && word.start_time && <span className="tooltiptext"> Wort könnten nicht erkannt werden!</span>}
          </div>
        )}
      </p>
    </div>
    <div className="custom-card-action">

    </div>
  </div>
  )
};

export default TranscriptionCard;
