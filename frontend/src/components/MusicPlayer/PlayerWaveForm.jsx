import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import WaveSurfer from "wavesurfer.js";
//import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
//import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import styles from "./waveform.module.css";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "violet",
  progressColor: "purple",
  cursorColor: "purple",

  //plugins: [
  //  TimelinePlugin.create({
  //    container: "#wave-timeline",
  //    deferInit: true, // stop the plugin from initialising immediately
  //  }),
  //  MinimapPlugin.create(),
  //],

  //barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 100,
  width: 1000,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
});

const PlayerWaveForm = ({ url }) => {
  const { container, wave, button, controls } = styles;

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlaying(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.add;

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function () {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);

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
      setPlaying(false);
    });

    return () => wavesurfer.current.destroy();
  }, [url]);

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

  return (
    <div className={container}>
      <div
        id="wave-timeline"
        ref={waveformRef}
        //onTimeChange={onTimeChange}
        className={wave}
      />
      {currentTime && <h5>{Math.round(currentTime)} : </h5>}
      {duration && <h5>{Math.round(duration)} s</h5>}
      <div className={controls}>
        <button className={button} onClick={handlePlayPause}>
          {!playing ? "Play" : "Pause"}
        </button>
        <input
          type="range"
          id="volume"
          name="volume"
          // waveSurfer recognize value of `0` same as `1`
          //  so we need to set some zero-ish value for silence
          min="0.01"
          max="1"
          step=".025"
          onChange={onVolumeChange}
          defaultValue={volume}
        />
        <label htmlFor="volume">Volume</label>
      </div>
    </div>
  );
};

export default PlayerWaveForm;
