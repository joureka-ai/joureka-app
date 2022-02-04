import Head from "next/head";
import React, {useEffect, useState} from "react";
import {faChevronLeft, faChevronRight, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProjectBar from "../components/ProjectBar/ProjectBar";
import SearchBar from "../components/SearchBar/SearchBar";
import {projectService} from "../services";
import LoadingSpinnerOverlay from "../components/LoadingSpinner/LoadingSpinnerOverlay";
import {useRouter} from "next/router";

const ITEMS_PER_PAGE = 10;

const Home = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
   projectService.getAllProjects().then(projects => setProjects(projects));
  }, []);

  const filteredProjects = filterProjects(projects, searchQuery);
  const pageProjects = getPageData(filteredProjects, pageIndex);
  return (
    <React.Fragment>
      <Head>
        <title>joureka</title>
      </Head>
      {!projects && <LoadingSpinnerOverlay text={"Projete werden geladen!"}/>
      }
      <div className="main-container d-flex flex-column">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-start py-4">
          <h2>Mein Arbeitsplatz</h2>
          <SearchBar searchQuery={searchQuery}
                     setSearchQuery={setSearchQuery}
                     placeholder={"Projekte durchsuchen"}/>
        </div>
        <button className="border-button border-button-orange" onClick={() => router.push("/project/create")}><FontAwesomeIcon icon={faPlus} /><span className="px-3">neues Projekt erstellen</span></button>
        {pageProjects && pageProjects.map(project => (
          <ProjectBar project={project} key={project.id}/>
        ))}
        {projects && projects.length === 0 &&
          <div className="d-flex justify-content-center align-items-center vh-80 flex-column">
            <h5>Sie haben kein Projekt angelegt!</h5>
            <p className="text-center">Beginnen Sie mit der Erkundung Ihrer Interviews, indem
              Sie ein neues Projekt erstellen.</p>
          </div>
        }
        {projects && <div
          className={`d-flex flex-row pt-4 ${!showPrevArrow(pageIndex) ? 'justify-content-end' : 'justify-content-between'}`}>
          {showPrevArrow(pageIndex) &&
          <button onClick={() => setPageIndex(pageIndex - 1)} className="icon-button-round mx-2">
            <FontAwesomeIcon icon={faChevronLeft}/></button>}
          {showNextArrow(pageIndex, filteredProjects) &&
          <button onClick={() => setPageIndex(pageIndex + 1)} className="icon-button-round mx-2">
            <FontAwesomeIcon icon={faChevronRight}/></button>}
        </div>
        }
      </div>
    </React.Fragment>
  );
};

const filterProjects = (projects, query) => {
  if (!query) {
    return projects;
  }

  return projects.filter((project) => {
    const projectName = project.name.toLowerCase();
    return projectName.includes(query);
  });
};

const getPageData = (projects, page) => {
  if(projects)  return projects.slice(page*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE+ITEMS_PER_PAGE);
};

const showNextArrow = (currentPageIndex, filteredProjects) => {
  return currentPageIndex < (filteredProjects.length/ITEMS_PER_PAGE) - 1;
};

const showPrevArrow = (currentPageIndex) => {
  return currentPageIndex > 0;
};


export default Home;
