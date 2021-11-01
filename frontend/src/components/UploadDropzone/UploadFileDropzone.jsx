import React, {useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileAudio, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {projectService} from "../../services";
import LoadingSpinnerOverlay from "../LoadingSpinner/LoadingSpinnerOverlay";
import Modal from "../Modal/Modal";

function UploadFileDropzone(props) {
  const router = useRouter();
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [savingFiles, setSavingFiles] = useState(false);
  const [currentProject, setCurrentProject] = useState(JSON.parse(localStorage.getItem('created-project')));
  const [showingDocumentDeleteModal, setShowingDocumentDeleteModal] = useState(false);
  const [toBeRemovedDocument, setToBeRemovedDocument] = useState(null);
  const [uploadError, setUploadError] = useState(false);

  const { getRootProps, getInputProps} = useDropzone({
    accept: "audio/*",
    maxFiles: 4,
    multiple: true,
    onDrop: files => setFiles(files)
  });

  useEffect(() => {
   projectService.getAllDocuments(currentProject.id).then(docs => setUploadedDocuments(docs));
  }, []);

  function removeFiles(e, fileIndex) {
    e.stopPropagation();
    const newFiles = [...files];
    newFiles.splice(fileIndex, 1);
    setFiles(newFiles);
  }

  function saveFiles() {
    let filesUploaded = 0;
    let createdDoc;
    files.forEach(file => {
      console.log(file);
      setSavingFiles(true);

      let fileData = {
        "title": file.path,
        "language": "de-DE",
        "fk_project": currentProject.id
      };
      projectService.createDocument(currentProject.id, fileData).then(document => {
        setFiles([]);
        createdDoc = document;
        projectService.saveFile(currentProject.id, document.id, file).then(() => {
          projectService.getAllDocuments(currentProject.id).then(docs => setUploadedDocuments(docs));
          filesUploaded++;
          if (filesUploaded === files.length) {
            setSavingFiles(false);
          }
        }).catch(error => {
          console.log(error)
          setSavingFiles(false);
          setUploadError(true);
          /*projectService.deleteDocument(createdDoc.id).then(() => {
            projectService.getAllDocuments(currentProject.id).then(docs => setUploadedDocuments(docs));
          })*/
        });
      });
      });
  }

  function removeUploadedDoc(docId) {
    projectService.deleteDocument(currentProject.id, docId).then(
      projectService.getAllDocuments(currentProject.id).then(docs => {
        setUploadedDocuments(docs);
        setShowingDocumentDeleteModal(false);
      })
    )
  }

  function showDocumentDeleteModal(file) {
    setToBeRemovedDocument(file);
    setShowingDocumentDeleteModal(true);
  }

  return (
    <section className="container">
      {savingFiles && <LoadingSpinnerOverlay text={"Audiodateien werden gespeichert!"}/>
      }
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} multiple/>
        <p>Drag 'n' drop some files here, or click to select files</p>
        <p><em>(Only *.mp3 and *.avi images will be accepted)</em></p>
        {files && files.map((file, index) => (
          <div key={index} className="d-flex justify-content-between align-items-center">
            <FontAwesomeIcon icon={faFileAudio}/>
            <div className="px-2 fw-bold">{file.path}</div>
            <div className="">{(file.size / 1048576).toFixed(2)} MB</div>
            <button className="icon-button-transparent icon-orange mx-2" onClick={(e) => removeFiles(e, index)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
      </div>
      <div className="d-flex flex-column justify-content-end align-items-end py-3">
        <button disabled={files?.length === 0} onClick={saveFiles} id="submit-dropzone-btn" className="full-width custom-button custom-button-sm custom-button-orange">
          Dateien hochladen
        </button>
        {uploadedDocuments.length === 0 && <button onClick={() => router.push(`/project/${currentProject.id}`)} className=" full-width custom-button custom-button-sm custom-button-transparent">Dateien Später hochladen</button>}
      </div>
      {uploadError && <div>Datei konnte nich hochgeladet werden!</div>}
      {uploadedDocuments.length !== 0 &&
      <div className="mt-4">
        <div className="fw-bold">Hochgeladene Dateien:</div>
        <div className="uploaded-files-container">
          {uploadedDocuments.map(file =>
            <div className="uploaded-files-item" key={file.id}>
              <div>{file.title}</div>
              <button className="icon-button-transparent icon-orange mx-2" onClick={() => showDocumentDeleteModal(file)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )}
        </div>
      </div>
      }
      {uploadedDocuments.length !== 0 && <div className="d-flex flex-column flex-md-row justify-content-end align-items-end pt-3">
        <button onClick={() => router.push(`/project/${currentProject.id}`)} className="custom-button custom-button-sm custom-button-blue">Bearbeitung beenden</button>
      </div>}
      <Modal
        title={"Audiodatei löschen"}
        onClose={() => setShowFileDeleteModal(false)}
        onConfirm={() => removeUploadedDoc(toBeRemovedDocument.id)}
        show={showingDocumentDeleteModal}
        onCloseButton={"Abbrechen"}
        onConfirmButton={"Löschen"}
      >
        <div>Möchten Sie die ausgewählte Audiodatei wirklich löschen?</div>
      </Modal>
    </section>
  );
}

export default UploadFileDropzone;
