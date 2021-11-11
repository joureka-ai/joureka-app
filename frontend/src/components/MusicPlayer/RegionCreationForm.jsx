import React, {useEffect, useState} from "react";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";
import {v4 as uuidv4} from "uuid";
import { useRouter } from 'next/router'


const RegionCreationForm = ({region, onCancel}) => {
  const router = useRouter();
  const { pid, rid } = router.query;
  const [regionFormValues, setRegionFormValues] = useState({
    regionLabel: "",
    regionDescription: ""
  });
  const [regionFormErrors, setRegionFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = () => {
    region.id = uuidv4(),
    region.data.label = regionFormValues.regionLabel;
    region.data.description = regionFormValues.regionDescription;
    region.color = "rgb(30, 143, 158, 0.2)";
    console.log(region)
    let r = {
      external_id: region.id,
      start: region.start,
      end: region.end,
      data: {
        label: region.data.label,
        description: region.data.description
      }
    }
    waveformAnnotationService.addRegion(pid, rid, r);
    window.scroll({
      top: 0,
      left: 0,
    });
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setRegionFormValues({...regionFormValues, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegionFormErrors(validate(regionFormValues));
    setIsSubmitting(true);
  };

  const validate = (values) => {
    let errors = {};
    if (!values.regionLabel) {
      errors.regionLabel = "Titel darf nicht leer sein!";
    }
    if(!region) {
      errors.region = "Eine Region muss markiert werden!"
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(regionFormErrors).length === 0 && isSubmitting) {
      submitForm();
    }
  }, [regionFormErrors]);

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
        <h4>Themengebiet hinzufügen</h4>
        <div>Markieren Sie den gewünschten Bereich in der Wellenform, um einen Themenbereich zu definieren, und geben Sie unten die gewünschte Beschreibung ein.</div>
        <form onSubmit={e => { e.preventDefault(); }} role="form" name="add-region-form" className="py-3">
          {regionFormErrors.region && (
            <span className="input-error">{regionFormErrors.region}</span>
          )}
          {region && <div className="fw-bolder mt-3">Markiertes Bereich:</div>}
          {region && <div className="d-flex justify-content-between align-items-center flex-row">
            <div className="form-group full-width me-2">
                <label htmlFor="start">Start</label>
                <input value={getTimeFromSeconds(region.start)} className="form-control custom-input custom-input-blue full-width" type="time" id="start" name="start"
                       min="00:00:00" max="04:00:00" step="1" readOnly/>
              </div>

              <div className="form-group full-width">
                <label htmlFor="end">Ende</label>
                <input value={getTimeFromSeconds(region.end)}  className="form-control custom-input custom-input-blue full-width" type="time" id="end" name="end"
                       min="00:00:00" max="04:00:00" step="1" readOnly/>
              </div>
            </div>}
          <div className="form-group">
            <label htmlFor="regionLabel">Titel</label>
            <input value={regionFormValues.regionLabel} onChange={handleChange} type="text" id="regionLabel"
                   className="form-control custom-input custom-input-blue" name="regionLabel"/>
            {regionFormErrors.regionLabel && (
              <span className="input-error">{regionFormErrors.regionLabel}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="regionDescription">Beschreibung</label>
            <textarea value={regionFormValues.regionDescription} onChange={handleChange} type="textarea" id="regionDescription"
                   className="form-control custom-input custom-input-blue" rows="4" name="regionDescription"/>
            {regionFormErrors.regionDescription && (
              <span className="input-error">{regionFormErrors.regionDescription}</span>
            )}
          </div>
        </form>
        <div className="d-flex flex-row justify-content-start">
          <button onClick={handleSubmit} className="custom-button custom-button-blue">
            Speichern
          </button>
          <button onClick={() => onCancel()}className="custom-button custom-button-sm custom-button-transparent">Abbrechen</button>
        </div>
      </div>
    );
};

export default RegionCreationForm;
