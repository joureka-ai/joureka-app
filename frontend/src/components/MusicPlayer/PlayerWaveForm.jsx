import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import styles from "./waveform.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#1E8F9E",
  progressColor: "#BDD4D7",
  cursorColor: "#EB8F49",
  cursorWidth: 2,
  backend: 'WebAudio',
  plugins: [
    RegionsPlugin.create({
      regions: [],
      dragSelection: {
        slop: 5
      }
    })
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
      // https://wavesurfer-js.org/docs/methods.html
      //wavesurfer.current.play();
      //setPlay(true);
      setLoading(false);

      // make sure object still available when file loaded
      if (wavesurfer) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
        const duration = wavesurfer.current.getDuration();
        setDuration(duration);
        const currentTime = wavesurfer.cuurent.getCurrentTime();
        setCurrentTime(currentTime);
      }
    });

    wavesurfer.current.on("seek", () => {
      console.log("seek");

      console.log(Object.entries(wavesurfer.current.regions.list));
      setRegions(Object.entries(wavesurfer.current.regions.list));

      const currentTime = wavesurfer.current.getCurrentTime();
      setCurrentTime(currentTime);
    });

    wavesurfer.current.on("interaction", () => {
      console.log("interaction");

      console.log(Object.entries(wavesurfer.current.regions.list));
      setRegions(Object.entries(wavesurfer.current.regions.list))
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
      <div className="d-flex justify-content-end align-items-center pt-1">
        {currentTime && <span>{getTimeFromSeconds(Math.round(currentTime))}</span>}/{duration && <span>{getTimeFromSeconds(Math.round(duration))}</span>}
      </div>
      {regions && regions.map(region => <div>REGION {region[1].start} - {region[1].end}</div>)}
    </React.Fragment>
  );
};

export default PlayerWaveForm;
