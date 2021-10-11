import React, { useEffect, useState } from "react";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";
import {v4 as uuidv4} from "uuid";

const PinCreationForm = ({currentTime, onCancel}) => {
  const [pinFormValues, setPinFormValues] = useState({
    pinLabel: "",
    pinDescription: ""
  });
  const [pinTime, setPinTime] = useState({});
  const [pinFormErrors, setPinFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = () => {
    waveformAnnotationService.addPin({
      id: uuidv4(),
      time: currentTime,
      position: "top",
      color: '#ff990a',
      label: pinFormValues.pinLabel,
      description: pinFormValues.pinDescription
    })
    setPinFormValues({
      pinLabel: "",
      pinDescription: ""
    });
    onCancel();
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setPinFormValues({...pinFormValues, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPinFormErrors(validate(pinFormValues));
    setIsSubmitting(true);
  };

  const validate = (values) => {
    let errors = {};
    if (!values.pinLabel) {
      errors.pinLabel = "Titel darf nicht leer sein!";
    }
    return errors;
  };

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
      <h4>Themengebiert hinzufügen</h4>
      <div>Markieren Sie den gewünschten Zeitpunkt in der Wellenform, um einen Themenbereich zu definieren, und geben Sie unten die gewünschte Beschreibung ein.</div>
      <form role="form" name="add-pin-form">
        <div className="form-group full-width">
          <label htmlFor="time">Zeitpunkt</label>
          <input value={pinTime} className="form-control custom-input custom-input-orange full-width" type="time" id="time" name="time"
                 min="00:00:00" max="04:00:00" step="1" readOnly/>
        </div>
        <div className="form-group">
          <label htmlFor="pinLabel">Titel</label>
          <input value={pinFormValues.pinLabel} onChange={handleChange} type="text" id="pinLabel"
                 className="form-control custom-input custom-input-blue" name="pinLabel"/>
          {pinFormErrors.pinLabel && (
            <span className="input-error">{pinFormErrors.pinLabel}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="pinDescription">Beschreibung</label>
          <textarea value={pinFormValues.pinDescription} onChange={handleChange} type="textarea" id="pinDescription"
                    className="form-control custom-input custom-input-blue" rows="4" name="pinDescription"/>
          {pinFormErrors.pinDescription && (
            <span className="input-error">{pinFormErrors.pinDescription}</span>
          )}
        </div>
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
