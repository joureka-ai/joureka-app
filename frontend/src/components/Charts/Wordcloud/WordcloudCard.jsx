import React, {useState, useEffect} from "react";
import { ParentSize } from "@visx/responsive";
import CustomWordcloud from "./Wordcloud";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronUp, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { chartsDataService } from "../../../services/chartsData.service";
import { useRouter } from "next/router";

const WORDCLOUD_THRESHOLD = 50;

const WordcloudCard = () => {
  const router = useRouter();
  const { pid } = router.query;
  const [selectedWord, setSelectedWord] = useState({});
  const [words, setWords] = useState(null)

  useEffect(() => {
    chartsDataService.getWordcloudWords(pid,WORDCLOUD_THRESHOLD).then((w) => {
      console.log(w.words)
      setWords(w.words);
    })
  }, []);

  return (
    <div className="custom-card">
        <div className="custom-card-header">
            <div className="custom-card-title">
              <span>Wortwolke nach Häufigkeit</span>
              <div className={`d-inline-block custom-tooltip`}><button className="icon-button-transparent icon-orange mx-2">
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
                {<span className="tooltiptext">Sed a posuere mi, et viverra orci. Fusce in dui et justo gravida egestas. Cras ullamcorper nisi vel bibendum aliquet. Vivamus viverra lacinia justo, eget imperdiet lacus feugiat sed. Aliquam a arcu in orci congue viverra. Aenean sed orci eu urna laoreet imperdiet. Aenean pulvinar massa velit, ac varius sem pharetra vel. Integer gravida placerat suscipit. Sed congue tincidunt arcu, at dapibus mi blandit at. Pellentesque maximus vulputate purus, sed vestibulum urna tristique vel. Nam et bibendum orci, posuere imperdiet velit. Maecenas volutpat tortor nisl, et accumsan felis fermentum eu. In vitae lobortis justo.</span>}
              </div>
            </div>
        </div>
        <div className="custom-card-body">
            {!words && <LoadingSpinner text={"Grafik wird erstellt."}/>}
            {words && <ParentSize>{({ width, height }) => <CustomWordcloud width={width} height={height} words={words} setRecordingsList={setSelectedWord} showControls={false}/>}</ParentSize>}
        </div>
        {selectedWord.recordingsIds && <div>
          <div className="pb-3 d-flex justify-content-between">
            <span>Wort <b>{selectedWord.text}</b> kommt in folgenden Aufnahmen vor</span>
            <button onClick={() => setSelectedWord({})} className="icon-button-transparent icon-blue mx-2">
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
          <div className="chart-recordings-list">{
            selectedWord.recordingsIds.map((item, index) => (
              <div key={index} className="p-1 d-flex justify-content-between">
                <span className="fw-bolder">Aufnahme mit id {item}</span>
                <button className="custom-button custom-button-sm custom-button-blue">Zur Aufnahme</button>
              </div>
            ))
          }</div>
        </div> }
        <style jsx>{`
            .custom-card {
              width: 100%;
            }
            .custom-card-body {
              height: 350px;
            }
        `}</style>
    </div>
  )
};

export default WordcloudCard;
