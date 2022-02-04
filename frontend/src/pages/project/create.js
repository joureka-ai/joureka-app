import Head from "next/head";
import React from "react";
import { useRouter } from 'next/router';
import AddEditProjectForm from "../../components/AddEditProjectForm/AddEditProjectFrom";

const CreateProject = () => {
  const router = useRouter();

  return (
    <React.Fragment>
      <Head>
        <title>joureka - Projekt erstellen</title>
      </Head>
      <AddEditProjectForm/>
    </React.Fragment>
  )
};

export default CreateProject;
