import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";
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
import { useRouter } from 'next/router'


const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#1E8F9E",
  progressColor: "#BDD4D7",
  cursorColor: "#EB8F49",
  cursorWidth: 2,
  backend: 'WebAudio',
  plugins: [
    RegionsPlugin.create({
      maxRegions: 2
    }),
    MarkersPlugin.create(),
    TimelinePlugin.create({
      container: '#wave-timeline'
    })
  ],
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
  const router = useRouter();
  const { pid, rid } = router.query;
  const waveformRef = useRef(null);
  let wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [newRegion, setNewRegion] = useState(null);
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
      waveformAnnotationService.getRegions(pid, rid).subscribe(r => {
        setNewRegion(null);
        setToggleRegionForm(false);
        wavesurfer.current.regions.maxRegions = r.length + 1;
        setRegions([...r]);
        if(r){
          wavesurfer.current.clearRegions();
          r.forEach(function(region) {
            wavesurfer.current.addRegion(region);
          });
        }
      });

      waveformAnnotationService.getPins(pid, rid).subscribe(p => {
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
      let showNoteElem = document.querySelector('.annotation-subtitle');
      showNoteElem.innerHTML = `<div><b>Themengebiet: </b>${region.data.label}</div><div className="mt-3 me-5"><b>Beschreibung: </b>${region.data.description ? region.data.description: "-"}</div>`;
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

    wavesurfer.current.on('region-update-end', function(region) {
      region.drag = false;
      setNewRegion({...region});
    });

    return () => wavesurfer.current.destroy();
  }, []);

  useEffect(() => {
    console.log('Do something after toggleRegionForm has changed', toggleRegionForm);
    if(toggleRegionForm) {
      wavesurfer.current.enableDragSelection({});
    } else {
      wavesurfer.current.disableDragSelection();
      waveformAnnotationService.getRegions(pid, rid).subscribe(r => {
        setNewRegion(null);
        setToggleRegionForm(false);
        wavesurfer.current.regions.maxRegions = r.length + 1;
        setRegions([...r]);
        if(r){
          wavesurfer.current.clearRegions();
          r.forEach(function(region) {
            wavesurfer.current.addRegion(region);
          });
        }
      });
    }
  }, [toggleRegionForm]);

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
    return ((hours + ':' + minutes + ':' + seconds).substring(0, 8));
  };

  function showRegionForm() {
    setToggleRegionForm(!toggleRegionForm);
    setTogglePinForm(false);
  }

  function showPinForm() {
    setTogglePinForm(!togglePinForm);
    setToggleRegionForm(false);
  }

  function onCancelCreateRegion() {
    setToggleRegionForm(false);
    waveformAnnotationService.getRegions(pid, rid).subscribe(r => {
      setNewRegion(null);
      setToggleRegionForm(false);
      wavesurfer.current.regions.maxRegions = r.length + 1;

      setRegions([...r]);
      if(r){
        wavesurfer.current.clearRegions();
        r.forEach(function(region) {
          wavesurfer.current.addRegion(region);
        });
      }
    });
  }

  function onCancelCreatePin() {
    setTogglePinForm(false)
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
        <div className={`${wave} d-flex flex-column justify-content-center`}>
          <div id="wave" ref={waveformRef}/>
          <div id="wave-timeline" className="mt-3"></div>
        </div>
      </div>
      <div className="d-flex justify-content-end align-items-end flex-column pt-1">
        <div className="full-width d-flex justify-content-between align-items-start flex-row">
          <div className="annotation-subtitle vw-50"></div>
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
      {toggleRegionForm && <RegionCreationForm region={newRegion}  onCancel={onCancelCreateRegion}/>}
      {togglePinForm && <PinCreationForm currentTime={currentTime} onCancel={onCancelCreatePin}/>}
    </React.Fragment>
  );
};

export default PlayerWaveForm;
