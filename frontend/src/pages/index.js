import {useGetProjects} from "../useRequest";
import Head from "next/head";
import React from "react";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProjectBar from "../components/ProjectBar/ProjectBar";

const Home = () => {

  const { data, error } = useGetProjects();


  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <React.Fragment>
      <Head>
        <title>joureka</title>
      </Head>
      <div className="main-container d-flex flex-column">
        <h2 className="py-4">Mein Arbeitsplatz</h2>
        <button className="border-button"><FontAwesomeIcon icon={faPlus} /><span className="px-3">neues Projekt erstellen</span></button>
        {data.map(project => (
          <ProjectBar project={project} key={project.id}/>
        ))}
        {data.length == 0 &&
          <div className="d-flex justify-content-center align-items-center vh-80 flex-column">
            <h5>Sie haben kein Projekt angelegt!</h5>
            <p className="text-center">Beginnen Sie mit der Erkundung Ihrer Interviews, indem
              Sie ein neues Projekt erstellen.</p>
          </div>
        }
      </div>
    </React.Fragment>
  );
};
 export default Home;
