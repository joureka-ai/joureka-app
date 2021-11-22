import React, {useState} from "react";
import styles from "./Tabs.module.scss";
import RecordingsOverview from "../RecordingsOverview/RecordingsOverview";
import Example from "../Charts/Wordcloud/Wordcloud";
import { ParentSize } from "@visx/responsive";
import DragI from "../Charts/BubbleChart/BubbleChart";
import BubbleChartCard from "../Charts/BubbleChart/BubbleChartCard";
import WordcloudCard from "../Charts/Wordcloud/WordcloudCard";


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
        <div className="d-flex flex-column flex-xl-row align-center justify-content-between">
          <WordcloudCard></WordcloudCard>
          <BubbleChartCard></BubbleChartCard>
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
