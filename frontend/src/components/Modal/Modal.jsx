import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "../../styles/modal.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

const Modal = ({ show, onClose, onConfirm, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const handleConfirmClick = (e) => {
    e.preventDefault();
    onConfirm();
  }

  const modalContent = show ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          {title && <div className={styles.modalTitle}>{title}</div>}
          <a href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        <div className={styles.modalBody}>{children}</div>
        <div className={styles.modalActions}>
          <button onClick={handleCloseClick} className="custom-button custom-button-sm custom-button-transparent">Abbrechen</button>
          <button onClick={handleConfirmClick} className="custom-button custom-button-sm custom-button-orange">Löschen</button>

        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;
