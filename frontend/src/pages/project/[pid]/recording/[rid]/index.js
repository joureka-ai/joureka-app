import { useRouter } from 'next/router'
import Head from "next/head";
import React, {useEffect, useState} from "react";
import Nav from "../../../../../components/Nav/Nav";
import Player from "../../../../../components/MusicPlayer/Player";
import {projectService} from "../../../../../services";
import styles from "../../../../../styles/recording.module.scss"
import AnnotationsOverviewCard from "../../../../../components/AnnotationsOverviewCard/AnnotationsOverviewCard";
import TranscriptionCard from "../../../../../components/TranscriptionCard/TranscriptionCard";

const Recording = () => {
  const { recordingDataContainer, annotationsCardContainer, pinAnnotation } = styles;
  const router = useRouter();
  const { pid, rid } = router.query;
  const [recording, setRecording] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    projectService.getDocumentById(pid, rid).then(rec => setRecording(rec));
    projectService.getFileOfDocument(pid, rid).then(url => setFileUrl(url));
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Aufnahmeansicht</title>
      </Head>
      <div className="d-flex flex-row">
        <div className="sideNavContainer">
          <Nav/>
        </div>
        {recording && <div className="recordingPageContainer ms-2 ms-md-3">
          <h3>{recording.title}</h3>
          {fileUrl && <Player fileUrl={fileUrl}/>}
          <div className={`${recordingDataContainer} d-flex flex-row`}>
            <div className="transcriptionCardContainer vw-70">
              <TranscriptionCard/>
            </div>
            <div className={`${annotationsCardContainer} mt-3 vw-30`}>
              <AnnotationsOverviewCard/>
            </div>
          </div>

        </div>}
      </div>
    </React.Fragment>
  )
};

export default Recording;
