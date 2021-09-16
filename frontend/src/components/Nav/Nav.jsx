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

  const { data, error } = useGetProjects();
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <nav className={navContainer}>
      <div className={listItemContainer}>
        {data.map(project => (
          <Link href={`/project/${project.id}`}>
              <div className={`${linkItem} ${pid == project.id ? linkItemActive : ""}`}>
                {project.name}
              </div>
          </Link>
        ))}
      </div>
      <div className={buttonContainer}>
        <button className="custom-button custom-button-blue">
          Aufnahme hinzufügen
        </button>
        <button className="custom-button custom-button-orange">
          Neues <br/>Projekt
        </button>
      </div>
    </nav>
  );
};

export default Nav;
