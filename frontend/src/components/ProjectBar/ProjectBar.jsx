import React from "react";
import styles from "./projectBar.module.scss";
import Link from "next/link";

const ProjectBar = ({project}) => {
  const {projectBar, loader, loaderBar, inactive} = styles;
  return (
    <Link href={`/project/${project.id}`} className="disabled-link">
    <div className={projectBar}>
      <span>{project.name}</span><button className="custom-button custom-button-sm custom-button-orange">Zum Projekt</button>
    </div>
    </Link>
  );
};

export default ProjectBar;


