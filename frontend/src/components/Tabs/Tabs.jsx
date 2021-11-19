import React, {useState} from "react";
import styles from "./Tabs.module.scss";
import RecordingsOverview from "../RecordingsOverview/RecordingsOverview";
import Example from "../Charts/Wordcloud/Wordcloud";
import { ParentSize } from "@visx/responsive";
import DragI from "../Charts/BubbleChart/BubbleChart";


const Tabs = () => {
  const { tabHeader, tabContainer, tabBody, tab, inactive} = styles;
  const [activeTab, setActiveTab] = useState(1);

  function setCurrentTab(tabIndex) {
    setActiveTab(tabIndex);
  }

  return (
    <div className={tabContainer}>
      <div className={tabHeader}>
        <div className={`${tab} ${activeTab === 2 ? inactive: ""}`} onClick={() => setCurrentTab(1)}>
          Aufnahmenübersicht
        </div>
        <div className={`${tab} ${activeTab === 1 ? inactive: ""}`} onClick={() => setCurrentTab(2)}>
          Statistische Auswertung
        </div>
      </div>
      <div className={tabBody}>
        {activeTab === 1 && <RecordingsOverview/>}
        {activeTab === 2 && 
        <div className="d-flex flex-column flex-md-row align-center justify-content-between">
          <div className="custom-card">
            <div className="custom-card-header">
              <div className="custom-card-title">Wortwolke nach Vorkommen</div>
            </div>
            <div className="custom-card-body">
              <ParentSize>{({ width, height }) => <Example width={width} height={height} showControls={false}/>}</ParentSize>
            </div>
          </div>
          <div className="custom-card">
            <div className="custom-card-header">
              <div className="custom-card-title">Annotierte Themengebiete</div>
            </div>
            <div className="custom-card-body">
              <ParentSize>{({ width, height }) => <DragI width={width} height={height}/>}</ParentSize>
            </div>
          </div>
        </div>
        }
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

export default Tabs;
