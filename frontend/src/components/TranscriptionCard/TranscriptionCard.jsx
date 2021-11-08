import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPrint, faEdit } from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import styles from "../../styles/transcription.module.scss";
import ReactToPrint from 'react-to-print';
import SearchBar from "../../components/SearchBar/SearchBar";


const TranscriptionCard = ({document}) => {
  const [words, setWords] = useState(document.words);
  const [searchQuery, setSearchQuery] = useState('');


  const [inEditMode, setInEditMode] = useState(false);
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

  function highlightSearch(query) {
    if (query == "") {
      console.log(document.words)
      return document.words
    } else {
      let queryWords = query.split(" ");
      let tempWords = words;
      tempWords.forEach(w => {
        if(queryWords.indexOf(w.word) != -1) {
          w.highlight = true
        } else {
          w.highlight = false
        }
      });
      console.log("HIGHLIGHT")
      return tempWords
    }
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

  const highlightedWords = highlightSearch(searchQuery)
  return (
  <div className="custom-card">
    <div className="custom-card-header d-flex flex-row justify-content-between align-items-center">
      <div className="custom-card-title">Transkription</div>
      {!inEditMode && <div className="d-flex flex-row align-center">
       <div className="mx-3">
          <SearchBar searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery} 
                    placeholder={"Suche nach..."}/>
        </div>
        <button className="icon-button-transparent icon-blue mx-2" onClick={() => setInEditMode(true)}>
          <FontAwesomeIcon icon={faEdit} /></button>
          <ReactToPrint
          trigger={() => <button className="icon-button-transparent icon-blue mx-2" onClick={() => console.log("Edit")}>
          <FontAwesomeIcon icon={faPrint} /></button>}
          content={() => componentRef}
          documentTitle={document.title}
          pageStyle={pageStyle}
        />
      </div>}
    </div>
    <div className="custom-card-body">
      <div className={styles.transcriptionContainer}>
      {!inEditMode && <div className={styles.transcriptionContent} ref={el => (componentRef = el)}>
        {words.map((word, index) =>
          <div key={index} className={`d-inline-block ${word.confidence < 0.5 && word.start_time ? `custom-tooltip ${styles.lowConfidenceWord}` : ""}`}>{rederWordWithHighlight(word.word, searchQuery)}&nbsp;
            {word.confidence < 0.5 && word.start_time && <span className="tooltiptext"> Wort könnten nicht erkannt werden!</span>}
          </div>
        )}
        </div>}
        {inEditMode && <textarea disabled={!inEditMode} value={document.fulltext} type="textarea" rows="100" name="pinDescription"/>}
      </div>
    </div>
    {inEditMode &&<div className="custom-card-action">
         <div className="d-flex flex-column flex-md-row justify-content-end align-items-end">
          <button onClick={() => setInEditMode(false)} className="custom-button custom-button-sm custom-button-transparent mx-1">Abbrechen</button>
          <button onClick={() => console.log("Speichern")} className="custom-button custom-button-sm custom-button-blue">Änderungen speichern</button>
          </div>
    </div>}
  </div>
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