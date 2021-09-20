import { useRouter } from 'next/router'
import Head from "next/head";
import React from "react";
import {useGetFileForRecording, useGetRecording} from "../../../../../useRequest";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import Nav from "../../../../../components/Nav/Nav";
import Player from "../../../../../components/MusicPlayer/Player";

const Project = () => {
  const router = useRouter();
  const { pid, rid } = router.query;
  let { recording, error } = useGetRecording(pid, rid);
  let { file } = useGetFileForRecording(pid, rid);

  if (error) return <div>failed to load</div>;
  if (!recording) return <LoadingSpinner beingLoaded={"Projekt"}/>;

  return (
    <React.Fragment>
      <Head>
        <title>Aufnahmen</title>
      </Head>
      <div className="d-flex flex-row">
        <div className="sideNavContainer">
          <Nav/>
        </div>
        <div className="recordingPageContainer ms-2 ms-md-3">
          <h3>{recording.title}</h3>
          <Player fileUrl={file}/>
        </div>
      </div>
    </React.Fragment>
  )
};

export default Project;
