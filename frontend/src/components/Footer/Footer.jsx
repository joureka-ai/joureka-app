import styles from "./Footer.module.scss";
import React, {useState} from "react";
import Modal from "../Modal/Modal";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe, faPaperPlane} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  let privacyPolicyContent = require("../../../data/privacyPolicy");
  const [showingPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const [showingContactModal, setShowContactModal] = useState(false);

  return (
    <div className={styles.footerContainer}>
      <div className={styles.left}>
        <div className="d-flex flex-row justify-content-center">
          <button className="custom-button-transparent button-text-blue fw-bold" onClick={() => setShowPrivacyPolicyModal(true)}>Datenschutz</button>
          |
          <button className="custom-button-transparent button-text-blue fw-bold" onClick={() => setShowContactModal(true)}>Kontakt</button>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.logoContainer}>
          <img className="px-3" src="/logo.png" width="100" alt="joureka Logo"/>
          <span>&#169; joureka 2021</span>
        </div>
      </div>
      <Modal
        title={"Datenschutzerklärung"}
        show={showingPrivacyPolicyModal}
        onConfirm={() => setShowPrivacyPolicyModal(false)}
        onClose={() => setShowPrivacyPolicyModal(false)}
        onConfirmButton={"Schließen"}
      >
        <div className={styles.privacyPolicyContent}>
          <div className="pb-3">{ReactHtmlParser(privacyPolicyContent.description)}
          </div>
          {privacyPolicyContent.categories && privacyPolicyContent.categories.map((category, index) => (
            <div className="pt-2" key={index}>
              <h4 className="text-uppercase">{(index+1) + ". " + category.category_name}</h4>
              <p>{ReactHtmlParser(category.category_description)}</p>
              {category.subcategories && category.subcategories.map((subcategory, i) => (
                <div key={i} className="pb-2">
                  <h5>{subcategory.subcategory_name}</h5>
                  <p>{ReactHtmlParser(subcategory.subcategory_description)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        title={"Kontakt"}
        show={showingContactModal}
        onConfirm={() => setShowContactModal(false)}
        onClose={() => setShowContactModal(false)}
        onConfirmButton={"Schließen"}
      >
        <div className="pb-3">Teile uns Deine Fragen und Ideen mit!</div>
        <div className="d-flex justify-content-start align-items-center text-primary fw-bolder pt-2">
          <FontAwesomeIcon icon={faPaperPlane}/>
          <div className="px-2 bl"><a href="mailto:kontakt@joureka.ai">kontakt@joureka.ai</a></div>
        </div>
        <div className="d-flex justify-content-start align-items-center text-primary fw-bolder pt-2">
          <FontAwesomeIcon icon={faGlobe}/>
          <div className="px-2 bl">www.joureka.ai</div>
        </div>
      </Modal>
    </div>
  );
};

export default Footer;

