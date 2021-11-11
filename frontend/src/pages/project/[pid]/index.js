import { useRouter } from 'next/router'
import Head from "next/head";
import React, {useEffect, useState} from "react";
import Nav from "../../../components/Nav/Nav";
import Tabs from "../../../components/Tabs/Tabs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {projectService} from "../../../services";
import styles from "../../../styles/project.module.scss"
import ReactReadMoreReadLess from "react-read-more-read-less";


const Project = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [project, setProject] = useState(null);
  const {projectDescription} = styles;

  useEffect(() => {
   if(pid) projectService.getProject(pid).then(pro => setProject(pro));
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Projektübersicht</title>
      </Head>
      <div className="d-flex flex-row">
        <div className="sideNavContainer">
          <Nav/>
        </div>
        {project && <div className="projectPageContainer ms-2 ms-md-3">
         <div className="d-flex justify-content-start align-items-center flex-row mb-4">
           <h3>{project.name}</h3>
           <button onClick={() => router.push(`/project/${pid}/update`)} className="icon-button-transparent icon-orange mx-2">
             <FontAwesomeIcon icon={faEdit} />
           </button>
         </div>
         <div className={projectDescription}>
         <ReactReadMoreReadLess
                charLimit={400}
                readMoreText={"Mehr lesen ▼"}
                readLessText={"Weniger lesen ▲"}
            >
                {project.description}
            </ReactReadMoreReadLess>
            </div>
         <Tabs/>
       </div>}
      </div>
    </React.Fragment>
  )
};

export default Project;
