import useSWR from "swr";
import Link from "next/link";

import Player from "../MusicPlayer/Player";

import styles from "./renderData.module.css";

const RenderData = ({ value }) => {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  // the filter url should end with a "/" otherwise there will be a redirect
  const url = `/api/v1/filter/?filter=${value}&skip=0&limit=100`;

  const { data, error } = useSWR(url, fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  const dataComponents = data.map((item) =>
    value === "" ? (
      <></>
    ) : (
      <DisplayData
        key={item.document.id}
        title={item.document.title}
        document_id={item.document.id}
        words={item.document.words.length}
        headlines={item.headlines}
      />
    )
  );

  return <div>{dataComponents}</div>;
};

const Headline = ({ headline }) => {
  // build an array where each items represents one token of the headline.
  const formatedText = [];

  // populate the formatedText array from headline.tokens
  headline.tokens.map((item) => {
    // the match attribute of the token tells us if this token is
    // part of the match for the search query. Depending on it, we
    // set the style
    const style = item.match ? styles.headlineMatch : styles.headlineNoneMatch;

    formatedText.push(<div className={style}> {item.text} </div>);
  });
  return formatedText;
};

const Headlines = ({ headlines }) => {
  const listItems = headlines.map((item) => (
    <li key={item.text}>
      <Headline headline={item} />
    </li>
  ));
  return <ul>{listItems}</ul>;
};

const DisplayData = ({ title, document_id, words, headlines }) => {
  const { container, dataInfo } = styles;

  return (
    <div className={container}>
      <div className={dataInfo}>
        <h3>
          <Link
            href={{
              pathname: "/docs/[document_id]",
              query: { document_id: document_id },
            }}
          >
            {title}
          </Link>
        </h3>
        <Headlines headlines={headlines} />
      </div>
      <Player document_id={document_id} />
    </div>
  );
};

export default RenderData;
