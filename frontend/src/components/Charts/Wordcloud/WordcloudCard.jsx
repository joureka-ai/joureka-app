import React, {useState} from "react";
import Example from "../Charts/Wordcloud/Wordcloud";
import { ParentSize } from "@visx/responsive";


const WordcloudCard = () => {
  

  return (
    <div className="custom-card">
        <div className="custom-card-header">
            <div className="custom-card-title">Wortwolke nach Vorkommen</div>
        </div>
        <div className="custom-card-body">
            <ParentSize>{({ width, height }) => <Example width={width} height={height} showControls={false}/>}</ParentSize>
        </div>
        <style jsx>{`
            .custom-card {
            width: 400px;
            }
            .custom-card-body {
            height: 350px;
            
            }
        `}</style>
    </div>
  )
};

export default WordcloudCard;
