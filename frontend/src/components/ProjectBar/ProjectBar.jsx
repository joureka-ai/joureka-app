import React from "react";
import styles from "./projectBar.module.scss"
import Link from "next/link";

const ProjectBar = ({project}) => {
  project.done = project.id % 2 === 0;
  const {projectBar, loader, loaderBar, inactive} = styles;
  return (
    <Link href={project.done ? `/project/${project.id}` : ""} className="disabled-link">
    <div className={`${projectBar} ${project.done ? "" : inactive}`}>
      <span>{project.name}</span><button className="custom-button custom-button-sm custom-button-orange">Zum Projekt</button>
      {!project.done && <div className={loader}>
        <div className={loaderBar}>
        </div>
      </div>
      }
    </div>
    </Link>
  );
};

export default ProjectBar;


