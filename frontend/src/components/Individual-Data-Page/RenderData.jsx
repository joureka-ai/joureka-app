import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./renderData.module.css";
import Player from "../MusicPlayer/Player";

const RenderData = ({ query }) => {
  const { document_id } = query;
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:8888/api/v1/docs/${document_id}`,
    fetcher
  );

  console.log(data);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const dataComponents = (
    <DisplayData
      key={data.id}
      title={data.title}
      document_id={data.id}
      words={data.words}
      transcription={data.transcription}
    />
  );

  return <div>{dataComponents}</div>;
};

const DisplayData = ({ title, document_id, words, transcription }) => {
  const [time, setTime] = useState(null);
  const router = useRouter();

  console.log("time", time);
  const formatedText = [];
  words.map((item) => {
    if (item.confidence > 0.9) {
      formatedText.push(
        <a
          onClick={() => {
            setTime(item.start_time);
          }}
          className={styles.black}
        >
          {item.word}
        </a>
      );
    } else {
      formatedText.push(
        <a onClick={() => setTime(item.start_time)} className={styles.red}>
          {item.word}
        </a>
      );
    }
  });

  let transcript_element = <div> </div>;
  if (formatedText.length > 0) {
    transcript_element = (
      <div>
        <div className={styles.textContainer}>
          Formatted by confidence : {formatedText}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.linkStyles}>
        <Link href="/">Home</Link>
      </div>

      <div className={styles.linkStyles}>
        <span onClick={() => router.back()}>Back</span>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <Player document_id={document_id} />
      <div className={styles.dataContainer}>
        <div className={styles.dataLeft}>
          <h1>page info</h1>
        </div>
        <div className={styles.dataRight}>{transcript_element}</div>
      </div>
    </div>
  );
};

export default RenderData;
