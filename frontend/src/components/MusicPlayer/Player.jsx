import React, {useState} from "react";
import dynamic from 'next/dynamic';

const PlayerWaveForm = dynamic(() => import('./PlayerWaveForm'), { ssr: false });


const Player = ({fileUrl}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="custom-card">
      <div className="custom-card-header">
        <div className="custom-card-title"/>
      </div>
      <div className="custom-card-body">
        {fileUrl && <PlayerWaveForm url={fileUrl}/>}
      </div>
      <div className="custom-card-action">
      </div>
    </div>
  );
};

export default Player;