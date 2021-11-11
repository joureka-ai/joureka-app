import React, {useState} from "react";
import styles from "./Tabs.module.scss";
import RecordingsOverview from "../RecordingsOverview/RecordingsOverview";

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
        {activeTab === 2 && <p>Tab2</p>}
      </div>
    </div>
  )
};

export default Tabs;
