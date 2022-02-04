import React, {useEffect, useState} from "react";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbtack, faTimes} from "@fortawesome/free-solid-svg-icons";
import styles from "./AnnotationsOverviewCard.module.scss"
import Modal from "../Modal/Modal";
import { useRouter } from 'next/router'

const AnnotationsOverviewCard = () => {
  const { regionAnnotation, pinAnnotation, noContent } = styles;
  const router = useRouter();
  const { pid, rid } = router.query;

  const [regions, setRegions] = useState([]);
  const [pins, setPins] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentPin, setCurrentPin] = useState(null);
  const [showingRegionDeleteModal, setShowRegionDeleteModal] = useState(false);
  const [showingPinDeleteModal, setShowPinDeleteModal] = useState(false);


  useEffect(() => {
    let isMounted = true;
    waveformAnnotationService.getRegions(pid, rid).subscribe(r => {
      if (isMounted) setRegions([...r]);
    });
    waveformAnnotationService.getPins(pid, rid).subscribe(p => {
      if (isMounted) setPins([...p]);
    });
    return () => { isMounted = false };
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
    if(currentRegion) waveformAnnotationService.deleteRegion(pid, rid, currentRegion.id);
    setShowRegionDeleteModal(false);
  }

  function deletePin() {
    if(currentPin) waveformAnnotationService.deletePin(pid, rid, currentPin.id);
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
            onCloseButton={"Abbrechen"}
            onConfirmButton={"Löschen"}
          >
            <div>Möchten Sie das ausgewählte Themengebiet wirklich löschen?</div>
          </Modal>
          {pins && pins.map((pin, index) => <div key={index}
              className={`${pinAnnotation} d-flex justify-content-between align-items-center`}>
            <span>{pin.label}</span>
            <div onClick={() => showPinDeleteModal(pin)}><FontAwesomeIcon icon={faTimes}/></div>
          </div>)}
          <Modal
            title={"Pin löschen"}
            onClose={() => setShowPinDeleteModal(false)}
            onConfirm={() => deletePin()}
            show={showingPinDeleteModal}
            onCloseButton={"Abbrechen"}
            onConfirmButton={"Löschen"}
          >
            <div>Möchten Sie das ausgewählte Pin wirklich löschen?</div>
          </Modal>
          {regions.length == 0 && pins.length == 0 &&
            <div className={noContent}>
              <FontAwesomeIcon icon={faThumbtack} size="2x"/>
              <p>Sie haben noch keine Themengebiete oder Pins erstellt!</p>
            </div>
          }
        </div>
  )
};

export default AnnotationsOverviewCard;
