import { useRouter } from 'next/router'
import Head from "next/head";
import React, {useEffect, useState} from "react";
import Nav from "../../../../../components/Nav/Nav";
import Player from "../../../../../components/MusicPlayer/Player";
import {projectService} from "../../../../../services";
import styles from "../../../../../styles/recording.module.scss"
import RegionsOverviewCard from "../../../../../components/RegionsOverviewCard/RegionsOverviewCard";

const Project = () => {
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
          <div className="d-flex flex-row">
            <div className="transcription-card-container vw-70">
              <div className="custom-card">
                <div className="custom-card-header">
                  <div className="custom-card-title">Transcription</div>
                </div>
                <div className="custom-card-body">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu leo, lobortis ut tellus eu, convallis semper mi. Suspendisse eget lectus risus. Nunc viverra, quam nec aliquet tempor, odio risus scelerisque est, non luctus lectus purus id mauris. Donec tempor mattis blandit. Aenean viverra hendrerit maximus. Fusce at dolor lacus. Donec ac orci a odio commodo pharetra.

                    Nulla viverra nisl orci, congue pharetra dolor luctus sit amet. Nam laoreet augue ac tellus mattis lobortis. Praesent porta in magna id blandit. Nullam mollis velit at ante tristique feugiat. Nullam sapien nisl, vulputate non nisl vel, vulputate condimentum ipsum. Duis porta, justo mollis malesuada dapibus, enim nisl vulputate dolor, in tincidunt lectus massa et purus. Integer tristique purus nec risus lobortis tincidunt. Curabitur in ligula sed metus ornare condimentum. Etiam et tempor diam. Curabitur vel turpis arcu. In blandit leo venenatis, finibus dolor sed, posuere ante. Sed id ipsum ut est varius suscipit. Integer sit amet ligula ex. Suspendisse eu tellus tortor.

                    Aliquam fringilla tortor leo, malesuada viverra neque malesuada at. Duis tempor odio at sem viverra vestibulum. Duis efficitur sed tortor eu iaculis. Phasellus lacus lacus, sollicitudin id lectus quis, scelerisque malesuada tellus. Ut commodo commodo urna. Phasellus tortor nibh, cursus id pretium ut, tempus sit amet eros. Phasellus eget pretium sem, vitae lacinia est. Donec euismod, ipsum eu elementum semper, mauris dui varius ipsum, aliquet interdum odio velit sed massa. In lacinia, elit a aliquam suscipit, ex turpis feugiat quam, commodo ullamcorper elit tellus vel odio. Ut magna sapien, volutpat at nunc quis, semper convallis turpis. Etiam sit amet iaculis lacus, sit amet maximus felis. In dictum, nisi commodo convallis aliquet, dui lacus ultrices orci, lacinia sodales risus ligula nec dolor. Sed sagittis hendrerit rutrum. Integer mattis, mauris a consectetur consequat, dui enim pulvinar elit, in volutpat ante sapien fermentum erat. Nam dapibus magna sapien, at volutpat velit auctor vel.

                    Cras ut gravida ipsum, in tempor risus. Suspendisse ornare gravida maximus. Nam ut justo luctus, vulputate nulla ac, vulputate mauris. Maecenas nulla arcu, consequat sed neque vel, mollis sollicitudin ligula. Morbi iaculis a risus a posuere. Nunc sit amet consequat mauris, a scelerisque leo. Curabitur commodo quam sed velit fringilla, quis vulputate est dapibus. Nullam ac lectus eget nunc pellentesque gravida. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In sem nunc, convallis ut sodales sed, accumsan vel ipsum.</p>
                </div>
                <div className="custom-card-action">

                </div>
              </div>
            </div>
            <div className="regions-card-container vw-30">
              <RegionsOverviewCard/>
            </div>
          </div>

        </div>}
      </div>
    </React.Fragment>
  )
};

export default Project;
