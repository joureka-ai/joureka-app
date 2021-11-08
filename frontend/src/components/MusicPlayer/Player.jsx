import React, {useState} from "react";
import dynamic from 'next/dynamic';

const PlayerWaveForm = dynamic(() => import('./PlayerWaveForm'), { ssr: false });


const Player = ({fileUrl}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="custom-card">
      <div className="custom-card-body">
        {fileUrl && <PlayerWaveForm url={fileUrl}/>}
      </div>
    </div>
  );
};

export default Player;
