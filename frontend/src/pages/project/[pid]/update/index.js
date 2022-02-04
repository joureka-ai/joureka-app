import Head from "next/head";
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import {projectService} from "../../../../services";
import UploadFileDropzone from "../../../../components/UploadDropzone/UploadFileDropzone";
import AddEditProjectForm from "../../../../components/AddEditProjectForm/AddEditProjectFrom";

const UpdateProject = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { step } = router.query;
  const [project, setProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);

  useEffect(() => {
    if(pid) projectService.getProject(pid).then(p => {
      if(p) {
        setProject(p);
        setCurrentStep(step);
      } else {
        router.push('/')
      }
    });
  }, []);


  return (
    <React.Fragment>
      <Head>
        <title>joureka - Projekt bearbeiten</title>
      </Head>
      {project && <AddEditProjectForm project={project} currentStep={step}/>}
    </React.Fragment>
  )
};

export default UpdateProject;
