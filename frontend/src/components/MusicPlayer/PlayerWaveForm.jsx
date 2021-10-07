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
import PinCreationForm from "./PinCreationForm";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#1E8F9E",
  progressColor: "#BDD4D7",
  cursorColor: "#EB8F49",
  cursorWidth: 2,
  backend: 'WebAudio',
  plugins: [
    RegionsPlugin.create(),
    MarkersPlugin.create()
  ],
  //plugins: [
  //  TimelinePlugin.create({
  //    container: "#wave-timeline",
  //    deferInit: true, // stop the plugin from initialising immediately
  //  }),
  //  MinimapPlugin.create(),
  //],
  hideScrollbar: true,
  barWidth: 2,
  barRadius: 3,
  responsive: true,
  height: 150,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
  scrollbarWidth: 10,
  dragSelection: false,
});

const PlayerWaveForm = ({ url }) => {
  const { waveFormContainer, wave, controls } = styles;

  const waveformRef = useRef(null);
  let wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [regions, setRegions] = useState(null);
  const [pins, setPins] = useState(null);
  const [toggleRegionForm, setToggleRegionForm] = useState(false);
  const [togglePinForm, setTogglePinForm] = useState(false);

  useEffect(() => {

    setPlaying(false);
    setLoading(true);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function () {
      setLoading(false);
      waveformAnnotationService.getRegions().subscribe(r => {
        setRegions([...r]);
        if(r){
          wavesurfer.current.clearRegions();
          r.forEach(function(region) {
            wavesurfer.current.addRegion(region);
          });
        }
      });

      waveformAnnotationService.getPins().subscribe(p => {
        setPins([...p]);
        if(p){
          wavesurfer.current.clearMarkers();
          p.forEach(function(pin) {
            wavesurfer.current.addMarker(pin);
          });
        }
      });

      // make sure object still available when file loaded
      if (wavesurfer) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
        const duration = wavesurfer.current.getDuration();
        setDuration(duration);
        const currentTime = wavesurfer.curent.getCurrentTime();
        setCurrentTime(currentTime);
      }
    });

    wavesurfer.current.on("seek", () => {
      console.log("seek");
      const currentTime = wavesurfer.current.getCurrentTime();
      setCurrentTime(currentTime);
    });

    wavesurfer.current.on("region-mouseenter", (region) => {
      console.log("IN")
      console.log(region)
      let showNoteElem = document.querySelector('.annotation-subtitle');
      showNoteElem.innerHTML = `Themengebiet: <b>${region.data.label}</b>`;
    });

    wavesurfer.current.on("region-mouseleave", (region) => {
      let showNoteElem = document.querySelector('.annotation-subtitle');
      showNoteElem.innerHTML = "";
    });


    wavesurfer.current.on('region-click', function(region, e) {
      e.stopPropagation();
      e.shiftKey ? region.playLoop() : region.play();
      setPlaying(true);
    });

    return () => wavesurfer.current.destroy();
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer.current.playPause();
  };

  const getTimeFromSeconds = (secs) => {
    let hours   = Math.floor(secs / 3600);
    let minutes = Math.floor((secs - (hours * 3600)) / 60);
    let seconds = secs - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours   = "0"+ hours; }
    if (minutes < 10) {minutes = "0"+ minutes; }
    if (seconds < 10) {seconds = "0"+ seconds; }
    return hours + ':' + minutes + ':' + seconds;
  };

  function showRegionForm() {
    setToggleRegionForm(!toggleRegionForm);
    setTogglePinForm(false);
  }

  function showPinForm() {
    setTogglePinForm(!togglePinForm);
    setToggleRegionForm(false);
  }

  return (
    <React.Fragment>
      {loading && <LoadingSpinnerOverlay text={"Audiodatei wird geladen!"}/>
      }
      <div className={waveFormContainer}>
        <div className={controls}>
          <button onClick={handlePlayPause} className="icon-button-round mx-2">
            {!playing ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
          </button>
        </div>
        <div id="wave-timeline" ref={waveformRef} className={wave}/>
      </div>
      <div className="d-flex justify-content-end align-items-end flex-column pt-1">
        <div className="full-width d-flex justify-content-between align-items-center flex-row">
          <div className="annotation-subtitle"></div>
          <div>{currentTime && <span>{getTimeFromSeconds(Math.round(currentTime))}</span>}/{duration && <span>{getTimeFromSeconds(Math.round(duration))}</span>}</div>
        </div>
        <div className="d-flex flex-row pt-2">
          <button className="custom-button custom-button-blue mx-2" onClick={showRegionForm}>
            <FontAwesomeIcon className="mx-1" icon={faPlus}/>Themengebiet hinzufügen
          </button>
          <button className="custom-button custom-button-orange" onClick={showPinForm}>
            <FontAwesomeIcon className="mx-1" icon={faPlus}/>Pin hinzufügen
          </button>
        </div>
      </div>
      {toggleRegionForm && <RegionCreationForm/>}
      {togglePinForm && <PinCreationForm/>}
    </React.Fragment>
  );
};

export default PlayerWaveForm;
