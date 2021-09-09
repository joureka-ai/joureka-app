import useSWR from "swr";
import styles from "./player.module.css";
import PlayerWaveForm from "./PlayerWaveForm";

const Player = ({ currentTime, document_id }) => {
  const docUrl = `/api/v1/docs/${document_id}`;
  const streamUrl = `/api/v1/docs/${document_id}/file`;
  const { container } = styles;

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(docUrl, fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className={container}>
      <PlayerWaveForm url={streamUrl} />
    </div>
  );
};

export default Player;
