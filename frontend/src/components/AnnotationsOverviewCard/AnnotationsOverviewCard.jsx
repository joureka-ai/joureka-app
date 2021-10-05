import React, {useEffect, useState} from "react";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import styles from "./annotationsOverviewCard.module.scss"

const AnnotationsOverviewCard = () => {
  const { regionAnnotation, pinAnnotation } = styles;

  let [regions, setRegions] = useState([]);
  const [pins, setPins] = useState(null);

  useEffect(() => {
    waveformAnnotationService.getRegions().subscribe(r => {
      setRegions([...r]);
    });
    waveformAnnotationService.getPins().subscribe(p => {
      console.log("SUBSCRIBE PINS")
      setPins([...p]);
    });
  }, []);

  return (
        <div className="d-flex flex-column">
          {regions.length > 0 && regions.map((region, index) => <div key={index}
            className={`${regionAnnotation} d-flex justify-content-between align-items-center`}>
            <span>{region.data.label}</span><FontAwesomeIcon icon={faTimes}/></div>)}
          {pins && pins.map((pin, index) => <div key={index}
              className={`${pinAnnotation} d-flex justify-content-between align-items-center`}>
            <span>{pin.label}</span><FontAwesomeIcon icon={faTimes}/></div>)}
        </div>
  )
};

export default AnnotationsOverviewCard;
