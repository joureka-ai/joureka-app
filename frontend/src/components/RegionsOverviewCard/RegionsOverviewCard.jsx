import React, {useEffect, useState} from "react";
import Link from "next/link";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faTimes} from "@fortawesome/free-solid-svg-icons";

const RegionsOverviewCard = () => {
  const [regions, setRegions] = useState(null);
  const [pins, setPins] = useState(null);

  useEffect(() => {
    waveformAnnotationService.getRegions().subscribe(r => {
      setRegions(r);
    });
    waveformAnnotationService.getPins().subscribe(p => {
      console.log(p)
      setPins(p);
    });
  }, []);

  return (

        <div className="d-flex flex-column">
          {regions && regions["regionArray"].map(region => <button
            className="custom-button custom-button-sm custom-button-blue mx-2 mt-2 d-flex justify-content-between align-items-center">
            <span>{region[0]}</span><FontAwesomeIcon icon={faTimes}/></button>)}
          {pins && pins["pinArray"].map(pin => <button
            className="custom-button custom-button-sm custom-button-orange mx-2 mt-2 d-flex justify-content-between align-items-center">
            <input value={pin.label} disabled></input><FontAwesomeIcon icon={faTimes}/></button>)}
        </div>

  )
};

export default RegionsOverviewCard;
