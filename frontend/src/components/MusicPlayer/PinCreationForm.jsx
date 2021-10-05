import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import styles from "./waveform.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faPause, faPlay, faPlus} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {last} from "rxjs/operators";
import RegionCreationForm from "./RegionCreationForm";
import {v4 as uuidv4} from "uuid";

const PinCreationForm = () => {
  const validationPinSchema = Yup.object().shape({
    time: Yup.string().required('Start ist erforderlich!'),
    pinLabel: Yup.string().required('Label ist erforderlich!')
  });
  const pinFormOptions = { resolver: yupResolver(validationPinSchema) };
  const { register, handleSubmit, formState, reset } = useForm(pinFormOptions);
  const { errors } = formState;

  function addPin({ time, pinLabel }) {
    waveformAnnotationService.addPin({
      id: uuidv4(),
      time: time.split(':').reduce((acc,time) => (60 * acc) + +time),
      position: "top",
      color: '#ff990a',
      label: pinLabel

    })
    reset();
  }

  return (
    <form onSubmit={handleSubmit(addPin)} role="form" name="add-pin-form">
        <div className="d-flex justify-content-between align-items-center flex-row">

          <div className="form-group full-width">
            <label htmlFor="time">Zeitpunkt</label>
            <input {...register('time')} className="form-control custom-input-orange full-width" type="time" id="time" name="time"
                   min="00:00:00" max="04:00:00" step="1" required/>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="pinLabel">Label</label>
          <input  {...register('pinLabel')}type="text" id="pinLabel" className="form-control custom-input-orange" name="pinLabel"></input>
        </div>

        <button className="custom-button custom-button-orange">
          Speichern
        </button>
      </form>
  );
};

export default PinCreationForm;
