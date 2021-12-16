import { useRouter } from 'next/router'
import Head from "next/head";
import React, {useEffect, useState} from "react";
import Nav from "../../../../../components/Nav/Nav";
import Player from "../../../../../components/MusicPlayer/Player";
import {projectService} from "../../../../../services";
import styles from "../../../../../styles/recording.module.scss"
import AnnotationsOverviewCard from "../../../../../components/AnnotationsOverviewCard/AnnotationsOverviewCard";
import TranscriptionCard from "../../../../../components/TranscriptionCard/TranscriptionCard";
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Recording = () => {
  const { recordingDataContainer, annotationsCardContainer, pinAnnotation } = styles;
  const router = useRouter();
  const { pid, rid } = router.query;
  const [currentProject, setCurrentProject] = useState(null);
  const [recording, setRecording] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if(pid && rid) {
      projectService.getProject(pid).then(project => setCurrentProject(project))
      projectService.getDocumentById(pid, rid).then(rec => setRecording(rec));
      projectService.getFileOfDocument(pid, rid).then(url => setFileUrl(url));
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>joureka - Aufnahmeansicht</title>
      </Head>
      <div className="d-flex flex-row">
        <div className="sideNavContainer">
          <Nav/>
        </div>
        {recording && <div className="testSideNav">
          <div className="projectName mx-0 mx-md-1 mx-lg-2 mx-xl-3 mx-xxl-5" onClick={() => router.push(`/project/${pid}`)}> 
            <button className="icon-button-transparent mb-4">
              <FontAwesomeIcon size="lg" icon={faChevronLeft} />
            </button>
            <span>{currentProject.name}</span>
          </div>
          <div className="recordingPageContainer">
          <h4>{recording.title}</h4>
          {fileUrl && <Player fileUrl={fileUrl}/>}
          <div className={`${recordingDataContainer} d-flex flex-column flex-md-row`}>
            <div className="transcriptionCardContainer vw-80">
              <TranscriptionCard/>
            </div>
            <div className={`${annotationsCardContainer} mt-3 vw-20`}>
              <AnnotationsOverviewCard/>
            </div>
          </div>

        </div></div>}
      </div>
    </React.Fragment>
  )
};

export default Recording;
