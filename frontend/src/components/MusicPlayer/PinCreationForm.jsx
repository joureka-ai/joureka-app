import React, { useEffect, useState } from "react";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";
import {v4 as uuidv4} from "uuid";
import { useRouter } from 'next/router';
import AutoSuggestInput from "../AutosuggestInput/AutosuggestInput";
import { projectService } from "../../services";

const PinCreationForm = ({currentTime, onCancel}) => {
  const router = useRouter();
  const { pid, rid } = router.query;
  const [pinLabel, setPinLabel] = useState("")
  const [pinTime, setPinTime] = useState({});
  const [pins, setPins] = useState([]);
  const [pinFormErrors, setPinFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = () => {
    let p = {
      external_id: uuidv4(),
      start: currentTime,
      end: currentTime,
      data: {
        label: pinLabel
      }
    }
    waveformAnnotationService.addPin(pid, rid, p)
    setPinLabel("")
    onCancel();
    window.scroll({
      top: 0,
      left: 0,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPinFormErrors(validate(pinLabel));
    setIsSubmitting(true);
  };

  const validate = (label) => {
    let errors = {};
    if (!label) {
      errors.pinLabel = "Titel darf nicht leer sein!";
    }
    return errors;
  };

  useEffect(() => {
    projectService.getProjectPins(pid).then(pins => {
      if(pins.length > 0 || pins.annots) {
        const pinNames = pins.annots.map(p => p.name);
        setPins(pinNames);
      }
    }) 
  }, []);

  useEffect(() => {
    setPinTime(getTimeFromSeconds(currentTime));
  }, [currentTime]);

  useEffect(() => {
    if (Object.keys(pinFormErrors).length === 0 && isSubmitting) {
      submitForm();
    }
  }, [pinFormErrors]);

  const getTimeFromSeconds = (secs) => {
    let hours   = Math.floor(secs / 3600);
    let minutes = Math.floor((secs - (hours * 3600)) / 60);
    let seconds = secs - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours   = "0"+ hours; }
    if (minutes < 10) {minutes = "0"+ minutes; }
    if (seconds < 10) {seconds = "0"+ seconds; }
    return ((hours + ':' + minutes + ':' + seconds).substring(0, 8));
  };

  return (
    <div className="p-4">
      <h4>Pin hinzufügen</h4>
      <div>Markiere den gewünschten Zeitpunkt in der Wellenform, um einen Pin zu definieren.</div>
      <form onSubmit={e => { e.preventDefault(); }} role="form" name="add-pin-form" className="py-3">
        <div className="form-group full-width">
          <label htmlFor="time">Zeitpunkt</label>
          <input value={pinTime} className="form-control custom-input custom-input-blue full-width" type="text" id="time" name="time" readOnly/>
        </div>
        <div className="form-group">
          <label htmlFor="pinLabel">Titel</label>
          <AutoSuggestInput suggestionsList={pins} value={pinLabel} setValue={setPinLabel}></AutoSuggestInput>
          {pinFormErrors.pinLabel && (
            <span className="input-error">{pinFormErrors.pinLabel}</span>
          )}
        </div>
        {/*<div className="form-group">
          <label htmlFor="pinDescription">Beschreibung</label>
          <textarea value={pinFormValues.pinDescription} onChange={handleChange} type="textarea" id="pinDescription"
                    className="form-control custom-input custom-input-orange" rows="4" name="pinDescription"/>
          {pinFormErrors.pinDescription && (
            <span className="input-error">{pinFormErrors.pinDescription}</span>
          )}
        </div>*/}
        </form>
        <div className="d-flex flex-row justify-content-start">
          <button onClick={handleSubmit} className="custom-button custom-button-orange">
            Speichern
          </button>
          <button onClick={() => onCancel()} className="custom-button custom-button-sm custom-button-transparent">Abbrechen</button>
        </div>
    </div>
  );
};

export default PinCreationForm;
