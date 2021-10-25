import Link from "next/link";
import { useRouter } from 'next/router';
import styles from "./Nav.module.scss";
import React, {useState, useEffect} from "react";
import {projectService} from "../../services";

const Nav = () => {
  const {
    navContainer,
    listItemContainer,
    linkItemActive,
    linkItem,
    buttonContainer
  } = styles;
  const router = useRouter();
  const { pid } = router.query;
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    projectService.getAllProjects().then(projects => setProjects(projects));
  }, []);

  return (
    <nav className={navContainer}>
      <div className={listItemContainer} id="listItemContainer">
        {projects && projects.map(project => (
          <Link href={`/project/${project.id}`} key={`linkItem_${project.id}`}>
              <div id={`linkItem_${project.id}`} className={`${linkItem} ${pid == project.id ? linkItemActive : ""}`}>
                {project.name}
              </div>
          </Link>
        ))}
      </div>
      <div className={buttonContainer}>
        <button onClick={() => router.push({pathname: `/project/${pid}/update`, query: {step: 2}})} className="custom-button custom-button-sm custom-button-blue">
          Aufnahme hinzufügen
        </button>
        <button className="custom-button custom-button-sm custom-button-orange">
          Neues Projekt
        </button>
      </div>
    </nav>
  );
};

export default Nav;
