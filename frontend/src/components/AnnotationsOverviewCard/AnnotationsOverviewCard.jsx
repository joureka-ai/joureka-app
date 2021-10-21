import React, {useEffect, useState} from "react";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import styles from "./annotationsOverviewCard.module.scss"
import Modal from "../Modal/Modal";

const AnnotationsOverviewCard = () => {
  const { regionAnnotation, pinAnnotation } = styles;

  const [regions, setRegions] = useState([]);
  const [pins, setPins] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentPin, setCurrentPin] = useState(null);
  const [showingRegionDeleteModal, setShowRegionDeleteModal] = useState(false);
  const [showingPinDeleteModal, setShowPinDeleteModal] = useState(false);


  useEffect(() => {
    waveformAnnotationService.getRegions().subscribe(r => {
      setRegions([...r]);
    });
    waveformAnnotationService.getPins().subscribe(p => {
      console.log("SUBSCRIBE PINS")
      setPins([...p]);
    });
  }, []);

  function showRegionDeleteModal(region) {
    setCurrentRegion(region);
    setShowRegionDeleteModal(true);
  }


  function showPinDeleteModal(pin) {
    setCurrentPin(pin);
    setShowPinDeleteModal(true);
  }

  function deleteRegion() {
    if(currentRegion) waveformAnnotationService.deleteRegion(currentRegion);
    setShowRegionDeleteModal(false);
  }

  function deletePin() {
    if(currentPin) waveformAnnotationService.deletePin(currentPin);
    setShowPinDeleteModal(false);
  }

  return (
        <div className="d-flex flex-column">
          {regions.length > 0 && regions.map((region, index) => <div key={index}
            className={`${regionAnnotation} d-flex justify-content-between align-items-center`}>
            <span>{region.data.label}</span>
            <div onClick={() => showRegionDeleteModal(region)}><FontAwesomeIcon icon={faTimes}/></div>
          </div>)}
          <Modal
            title={"Themengebiet löschen"}
            onClose={() => setShowRegionDeleteModal(false)}
            onConfirm={() => deleteRegion()}
            show={showingRegionDeleteModal}
          >
            <div>Möchten Sie das ausgewählte Themengebiet wirklich löschen?</div>
          </Modal>
          {pins && pins.map((pin, index) => <div key={index}
              className={`${pinAnnotation} d-flex justify-content-between align-items-center`}>
            <span>{pin.label}</span>
            <div onClick={() => showPinDeleteModal(pin)}><FontAwesomeIcon icon={faTimes}/></div>
          </div>)}
          <Modal
            title={"Themengebiet löschen"}
            onClose={() => setShowPinDeleteModal(false)}
            onConfirm={() => deletePin()}
            show={showingPinDeleteModal}
            onCloseButton={"Abbrechen"}
            onConfirmButton={"Löschen"}
          >
            <div>Möchten Sie das ausgewählte Pin wirklich löschen?</div>
          </Modal>
        </div>
  )
};

export default AnnotationsOverviewCard;
