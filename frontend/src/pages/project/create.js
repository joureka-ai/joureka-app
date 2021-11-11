import Head from "next/head";
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import {projectService} from "../../services";
import styles from "../../styles/createProjectPage.module.scss"
import UploadFileDropzone from "../../components/UploadDropzone/UploadFileDropzone";
import AddEditProjectForm from "../../components/AddEditProjectForm/AddEditProjectFrom";

const CreateProject = () => {
  const router = useRouter();

  return (
    <React.Fragment>
      <Head>
        <title>Projekt erstellen</title>
      </Head>
      <AddEditProjectForm/>
    </React.Fragment>
  )
};

export default CreateProject;
