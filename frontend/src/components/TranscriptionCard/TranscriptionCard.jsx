import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPrint, faEdit } from "@fortawesome/free-solid-svg-icons";
import React, {useState, useEffect} from "react";
import styles from "./Transcription.module.scss";
import ReactToPrint from 'react-to-print';
import SearchBar from "../../components/SearchBar/SearchBar";
import { useRouter } from 'next/router'
import {projectService} from "../../services";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";

const TranscriptionCard = () => {
  const router = useRouter();
  const { pid, rid } = router.query;
  const [words, setWords] = useState([]);
  const [fulltext, setFulltext] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [inEditMode, setInEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  var componentRef;

  const pageStyle = `
  @page {
    size: auto;
    margin: 20mm;
    background-color: red !important;
   
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      background-color: white !important;
    }
    
    .pagebreak {
      page-break-before: always;
    }
  }
`;

  useEffect(() => {
    if(pid && rid) {
      projectService.getTranscriptionWords(pid, rid).then(res => {
        setWords(res.words);
      });
      projectService.getTranscriptionFulltext(pid, rid).then(fulltext => {
        setFulltext(fulltext);
      });
    }
  }, []);

  const handleChange = (e) => {
    const { value} = e.target;
    setFulltext(value)
  };

  const saveChanges = () => {
    setSaving(true);
    let startTime = words[0].start_time;
    let endTime = words[words.length-1].end_time;
    let transcriptionData= {
      start_time: startTime,
      end_time: endTime,
      text: fulltext
    }
    projectService.updateTranscription(pid, rid, transcriptionData).then(w => { 
      projectService.getTranscriptionWords(pid, rid).then(res => {
        setWords(res.words);
        projectService.getTranscriptionFulltext(pid, rid).then(fulltext => {
          setFulltext(fulltext);
          setInEditMode(false);
          setSaving(false);
        });
      });
     
    })
  }
  
  function rederWordWithHighlight(word, query){
    if (query == "") {
      return word
    } else {
      let queryWords = query.split(" ");
      queryWords = queryWords.map(q => q.toLowerCase())
      if(queryWords.indexOf(word.toLowerCase()) != -1) {
         return (
           <span className={styles.highlight}>{word}</span>
         )
        } else {
          return word
        }
    }
  }

  return (
    <React.Fragment>
      {saving && <LoadingSpinnerOverlay text={"Änderungen werden gespeichert!"}/> }
      <div className="custom-card">
        <div className="custom-card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div className="custom-card-title">Transkription</div>
          {!inEditMode && <div className="d-flex flex-row justify-content-start justify-content-md-center align-items-start ">
          <div className="mx-0 mx-md-3">
              <SearchBar searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery} 
                        placeholder={"Suche nach..."}/>
            </div>
            <button className="icon-button-transparent icon-blue mx-2" onClick={() => setInEditMode(true)}>
              <FontAwesomeIcon icon={faEdit} /></button>
              <ReactToPrint trigger={() => 
                <button className="icon-button-transparent icon-blue mx-2"><FontAwesomeIcon icon={faPrint} /></button>}
              content={() => componentRef}
              documentTitle={document.title}
              pageStyle={pageStyle}
            />
          </div>}
        </div>
        <div className="custom-card-body">
          <div className={styles.transcriptionContainer}>
          {!inEditMode && <div className={styles.transcriptionContent} ref={el => (componentRef = el)}>
            {words && words.map((word, index) =>
              <div key={index} className={`d-inline-block ${word.confidence < 0.5 && word.start_time ? `custom-tooltip ${styles.lowConfidenceWord}` : ""}`}>{rederWordWithHighlight(word.word, searchQuery)}&nbsp;
                {word.confidence < 0.5 && word.start_time && <span className="tooltiptext"> Wort könnten nicht erkannt werden!</span>}
              </div>
            )}
            </div>}
            {inEditMode && <textarea disabled={!inEditMode} value={fulltext} onChange={handleChange} type="textarea" rows="100" name="pinDescription"/>}
          </div>
        </div>
        {inEditMode &&<div className="custom-card-action">
            <div className="d-flex flex-column flex-md-row justify-content-end align-items-end">
              <button onClick={() => setInEditMode(false)} className="custom-button custom-button-sm custom-button-transparent mx-1">Abbrechen</button>
              <button onClick={() => saveChanges()} className="custom-button custom-button-sm custom-button-blue">Änderungen speichern</button>
              </div>
        </div>}
      </div>
    </React.Fragment>
  
  )
};

export default TranscriptionCard;

class ComponentToPrint extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <th>column 1</th>
          <th>column 2</th>
          <th>column 3</th>
        </thead>
        <tbody>
          <tr>
            <td>data 1</td>
            <td>data 2</td>
            <td>data 3</td>
          </tr>
          <tr>
            <td>data 1</td>
            <td>data 2</td>
            <td>data 3</td>
          </tr>
          <tr>
            <td>data 1</td>
            <td>data 2</td>
            <td>data 3</td>
          </tr>
        </tbody>
      </table>
    );
  }
}