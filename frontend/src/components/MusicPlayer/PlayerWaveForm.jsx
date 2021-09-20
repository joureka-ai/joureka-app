import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import styles from "./waveform.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#1E8F9E",
  progressColor: "#BDD4D7",
  cursorColor: "#EB8F49",


  //plugins: [
  //  TimelinePlugin.create({
  //    container: "#wave-timeline",
  //    deferInit: true, // stop the plugin from initialising immediately
  //  }),
  //  MinimapPlugin.create(),
  //],

  barWidth: 2,
  barRadius: 3,
  responsive: true,
  height: 100,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
});

const PlayerWaveForm = ({ url }) => {
  const { waveFormContainer, wave, controls } = styles;

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    console.log("USE EFFECT")
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
      console.log(loading)

      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
        const duration = wavesurfer.current.getDuration();
        setDuration(duration);
        const currentTime = wavesurfer.current.getCurrentTime();
        setCurrentTime(currentTime);
      }
    });

    wavesurfer.current.on("seek", () => {
      console.log("seek");
      //setPlaying(false);
      const currentTime = wavesurfer.current.getCurrentTime();
      setCurrentTime(currentTime);
    });

    wavesurfer.current.on("audioprocess", () => {
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

    if (hours < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
  }

  return (
    <div className={waveFormContainer}>
      <div className={controls}>
        <button onClick={handlePlayPause} className="icon-button-round mx-2">
          {!playing ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
        </button>
        {currentTime && <span>{getTimeFromSeconds(Math.round(currentTime))}</span>}/{duration && <span>{getTimeFromSeconds(Math.round(duration))}</span>}
      </div>
      <div id="wave-timeline" ref={waveformRef} className={wave}/>
    </div>
  );
};

export default PlayerWaveForm;
