import { useRouter } from 'next/router'
import Head from "next/head";
import React from "react";
import styles from "../../../styles/project.module.scss";
import Nav from "../../../components/Nav/Nav";
import Tabs from "../../../components/Tabs/Tabs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

const Project = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { sideNavContainer, projectPageContainer} = styles;

  return (
    <React.Fragment>
      <Head>
        <title>Projekt</title>
      </Head>
      <div className="d-flex flex-row">
        <div className={sideNavContainer}>
          <Nav/>
        </div>
       <div className={`ps-2 ps-md-3 ${projectPageContainer}`}>
         <div className="d-flex justify-content-start align-items-center flex-row mb-4">
           <h3>Project Name</h3>
           <button className="icon-button-transparent icon-orange mx-2">
             <FontAwesomeIcon icon={faEdit} />
           </button>
         </div>
         <Tabs/>
       </div>
      </div>
    </React.Fragment>
  )
};

export default Project;
