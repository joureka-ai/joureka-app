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
  const {projectDescription, projectSelection} = styles;
  const [currentSelection, setCurrentSelection] = useState("test");
  const [options, setOptions] = useState([])

  useEffect(() => {
   if(pid) projectService.getProject(pid).then(pro => setProject(pro));
   projectService.getAllProjects().then(projects => setOptions(projects));
  }, []);

  const handleChange = (event) => {
    setCurrentSelection(event.target.value);
    console.log(event.target.value)
    router.push(`/project/${event.target.value}`)
  };


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
         <div className="d-flex justify-content-start align-items-center flex-row mb-4 mr-5">
           <select className={projectSelection} onChange={handleChange} value={project.id}>
            {options.map(item => (
              <option key={item.name} value={item.id}>
                {item.name}
              </option>
            ))}
           </select>
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
