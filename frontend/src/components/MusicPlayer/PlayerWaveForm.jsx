import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import styles from "./waveform.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faPause, faPlay, faPlus} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";
import {waveformAnnotationService} from "../../services/waveformAnnotation.service";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#1E8F9E",
  progressColor: "#BDD4D7",
  cursorColor: "#EB8F49",
  cursorWidth: 2,
  backend: 'WebAudio',
  plugins: [
    RegionsPlugin.create({
      dragSelection: {
        slop: 5
      }
    }),
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
  dragSelection: true,
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
  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    console.log(url);
    setPlaying(false);
    setLoading(true);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function () {
      setLoading(false);

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

    return () => wavesurfer.current.destroy();
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = (e) => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
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

  function addRegion() {
    Object.entries(wavesurfer.current.regions.list).map(region => {
      region[1].drag = false;
    });
    setRegions(Object.entries(wavesurfer.current.regions.list));
    waveformAnnotationService.saveRegions(Object.entries(wavesurfer.current.regions.list));
  }

  function addPin() {
    let pinId = wavesurfer.current.markers.markers.length;
    wavesurfer.current.addMarker( {
      time: currentTime,
      label: "Pin " + pinId,
      color: '#ff990a'
    })
    setPins(wavesurfer.current.markers.markers)
    waveformAnnotationService.savePins(wavesurfer.current.markers.markers)
    console.log(wavesurfer.current.markers.markers)
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
        <div>{currentTime && <span>{getTimeFromSeconds(Math.round(currentTime))}</span>}/{duration && <span>{getTimeFromSeconds(Math.round(duration))}</span>}</div>
        <div className="d-flex flex-row pt-2">
          <button className="custom-button custom-button-blue mx-2" onClick={addRegion}>
            <FontAwesomeIcon className="mx-1" icon={faPlus}/>Themengebiet hinzufügen
          </button>
          <button className="custom-button custom-button-orange" onClick={addPin}>
            <FontAwesomeIcon className="mx-1" icon={faPlus}/>Pin hinzufügen
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PlayerWaveForm;
