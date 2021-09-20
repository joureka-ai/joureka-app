import Link from "next/link";
import { useRouter } from 'next/router';
import styles from "./Nav.module.scss";
import {useGetProjects} from "../../useRequest";
import React from "react";

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


  /*useEffect(() => {
    const divToScrollTo = document.getElementById(`linkItem_${pid}`);
    console.log(divToScrollTo.getBoundingClientRect().y)
    let scrollPositionY = divToScrollTo.getBoundingClientRect().y;
    document.getElementById('listItemContainer').scrollTo({top: scrollPositionY, behavior: 'smooth'});

  }, []);*/

  const { projects, error } = useGetProjects();
  if (error) return <div>failed to load</div>;
  if (!projects) return <div>loading...</div>;
  return (
    <nav className={navContainer}>
      <div className={listItemContainer} id="listItemContainer">
        {projects.map(project => (
          <Link href={`/project/${project.id}`} key={`linkItem_${project.id}`}>
              <div id={`linkItem_${project.id}`} className={`${linkItem} ${pid == project.id ? linkItemActive : ""}`}>
                {project.name}
              </div>
          </Link>
        ))}
      </div>
      <div className={buttonContainer}>
        <button className="custom-button custom-button-sm custom-button-blue">
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
