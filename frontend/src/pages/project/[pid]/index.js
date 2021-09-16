import { useRouter } from 'next/router'
import Head from "next/head";
import React from "react";
import styles from "../../../styles/project.module.scss";
import Nav from "../../../components/Nav/Nav";

const Project = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { sideNavContainer, projectPageContainer} = styles;

  return (
    <React.Fragment>
      <Head>
        <title>Projekt</title>
      </Head>
      <div className="d-flex flex-row vh-100">
        <div className={sideNavContainer}>
          <Nav/>
        </div>
       <div className={projectPageContainer}>{pid}</div>
      </div>
    </React.Fragment>
  )
};

export default Project;
