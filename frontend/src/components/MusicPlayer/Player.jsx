import React from "react";
import dynamic from 'next/dynamic';

const PlayerWaveForm = dynamic(() => import('./PlayerWaveForm'), {
  ssr: false
});


const Player = ({fileUrl}) => {
  console.log(fileUrl);
  return (
    <div className="custom-card">
      <div className="custom-card-header">
        <div className="custom-card-title"/>
      </div>
      <div className="custom-card-body">
        <PlayerWaveForm url={fileUrl}/>
      </div>
      <div className="custom-card-action">

      </div>
    </div>
  );
};

export default Player;
