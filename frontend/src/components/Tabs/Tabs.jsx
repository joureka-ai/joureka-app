import React, {useState} from "react";
import styles from "./Tabs.module.scss";
import RecordingsOverview from "../RecordingsOverview/RecordingsOverview";
import ChartsOverview from "../ChartsOverview/ChartsOverview";


const Tabs = () => {
  const {tabHeader, tabContainer, tabBody, tab, inactive} = styles;
  const [activeTab, setActiveTab] = useState(1);

  function setCurrentTab(tabIndex) {
    setActiveTab(tabIndex);
  }

  return (
    <React.Fragment>
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
        {activeTab === 2 && <ChartsOverview/>}
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
    </React.Fragment>
    
  )
};

export default Tabs;
