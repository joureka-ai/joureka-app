import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./MobileOverlay.module.scss";

const MobileOverlay = ({show}) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const mobileOverlayContent = show ? (
    <div className={styles.mobileOverlay}>
        <div className="alert alert-primary d-flex flex-row justify-content-center align-items-center vw-80" role="alert">
            <FontAwesomeIcon size="2x" icon={faRedo}></FontAwesomeIcon>
            <div className="mx-2">Schalten Sie das Telefon  in den Querformatmodus für ein besseres Erlebnis!</div>
        </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
        mobileOverlayContent,
        document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default MobileOverlay;
