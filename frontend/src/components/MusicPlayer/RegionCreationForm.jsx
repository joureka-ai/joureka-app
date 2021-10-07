import React from "react";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from 'uuid';

const RegionCreationForm = () => {
  const validationRegionSchema = Yup.object().shape({
    start: Yup.string().required('Start ist erforderlich!'),
    end: Yup.string().required('Ende ist erforderlich!'),
    regionLabel: Yup.string().required('Label ist erforderlich!')
  });
  const regionFormOptions = { resolver: yupResolver(validationRegionSchema) };
  const { register, handleSubmit, formState, reset } = useForm(regionFormOptions);
  const { errors } = formState;

  function addRegion({ start, end, regionLabel }) {
    waveformAnnotationService.addRegion({
      id: uuidv4(),
      start: start.split(':').reduce((acc,time) => (60 * acc) + +time),
      end: end.split(':').reduce((acc,time) => (60 * acc) + +time),
      drag: false,
      data: {
        label: regionLabel
      },
      color: "rgb(30, 143, 158, 0.2)"
    })
    reset();
  }

  return (
    <form onSubmit={handleSubmit(addRegion)} role="form" name="add-region-form" >
        <div className="d-flex justify-content-between align-items-center flex-row">
          <div className="form-group full-width me-2">
            <label htmlFor="start">Start</label>
            <input {...register('start')} className="form-control custom-input custom-input-blue full-width" type="time" id="start" name="start"
                   min="00:00:00" max="04:00:00" step="1" required/>
          </div>

          <div className="form-group full-width">
            <label htmlFor="end">Ende</label>
            <input {...register('end')} className="form-control custom-input custom-input-blue full-width" type="time" id="end" name="end"
                   min="00:00:00" max="04:00:00" step="1" required/>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="regionLabel">Label</label>
          <input {...register('regionLabel')} type="text" id="regionLabel" className="form-control custom-input custom-input-blue" name="regionLabel"></input>
          <div className="invalid-feedback">{errors.regionLabel?.message}</div>
        </div>

        <button className="custom-button custom-button-blue">
          Speichern
        </button>
      </form>
  );
};

export default RegionCreationForm;
