import Head from "next/head";
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import {projectService} from "../../services";
import UploadFileDropzone from "../../components/UploadDropzone/UploadFileDropzone";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal/Modal";


const AddEditProjectForm = (props) => {
  const router = useRouter();
  const project = props?.project;
  const step = props?.currentStep;
  const [currentStep, setCurrentStep] = useState( 1);
  const [projectFormValues, setProjectFormValues] = useState({
    projectTitle: project? project.name : "",
    projectDescription: project? project.description : ""
  });
  const [projectFormErrors, setProjectFormErrors] = useState({});
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [projectDocuments, setProjectDocuments] = useState(null);
  const [projectDataChanged, setProjectDataChanged] = useState(false);
  const [showingProjectDeleteModal, setShowProjektDeleteModal] = useState(false);


  const submitCreateForm = () => {
    projectService.createProject({
      name: projectFormValues.projectTitle,
      description: projectFormValues.projectDescription
    }).then((createdProject) => {
      sessionStorage.setItem('created-project', JSON.stringify(createdProject));
      setCurrentStep(2);
    }).catch(error => {
      setProjectFormErrors({projectTitle: "Ein gleichnamiges Projekt existiert bereits! Versuchen Sie es mit einem anderen Titel."})
    });
  };

  const submitUpdateForm = () => {
    projectService.updateProject(project.id, {
      name: projectFormValues.projectTitle,
      description: projectFormValues.projectDescription
    }).then((updatedProject) => {
      sessionStorage.setItem('created-project', JSON.stringify(updatedProject));
      setCurrentStep(2);
    });
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setProjectDataChanged(true);
    setProjectFormValues({...projectFormValues, [name]: value});
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    setProjectFormErrors(validate(projectFormValues));
    setIsSubmittingCreate(true);
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    setProjectFormErrors(validate(projectFormValues));
    setIsSubmittingUpdate(true);
  };

  const validate = (values) => {
    let errors = {};
    if (!values.projectTitle) {
      errors.projectTitle = "Titel darf nicht leer sein!";
    }
    return errors;
  };

  const deleteProject = () => {
    projectService.deleteProject(project.id).then(() => {
      router.push("/");
      setShowProjektDeleteModal(false);
    })
    
  }

  useEffect(() => {
    if (Object.keys(projectFormErrors).length === 0 && isSubmittingCreate) {
      submitCreateForm();
    }
    if (Object.keys(projectFormErrors).length === 0 && isSubmittingUpdate) {
      submitUpdateForm();
    }
  }, [projectFormErrors]);

  useEffect(() => {
    if(step) {
      setCurrentStep(parseInt(step));
    } else {
      setCurrentStep(1);
    }
    if (project) {
      sessionStorage.setItem('created-project', JSON.stringify(project));
      projectService.getAllDocuments(project.id).then(docs => {
        setProjectDocuments(docs);
      })
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Projekt erstellen</title>
      </Head>
      <div className="fadeInEffect main-container d-flex flex-column">
        <div className="stepper">
          <div className={`${currentStep === 1 ? "active" : ""} step`}><span>1</span></div>
          <hr size="3"/>
          <div className={`${currentStep === 2 ? "active" : ""} step`}><span>2</span></div>
        </div>
        {currentStep === 1 && <div className="custom-card">
          <div className="custom-card-header">
            <div className="custom-card-title text-uppercase d-flex justify-content-between">
              {project ? <span>Projekt bearbeiten</span> : <span>Projekt erstellen</span>}
              {project &&   <button className="icon-button-transparent icon-orange mx-2" onClick={() => setShowProjektDeleteModal(true)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>}
            <Modal
              title={"Projekt löschen"}
              onClose={() => setShowProjektDeleteModal(false)}
              onConfirm={() => deleteProject()}
              show={showingProjectDeleteModal}
              onCloseButton={"Abbrechen"}
              onConfirmButton={"Löschen"}
            >
              <div>Möchten Sie das Projekt wirklich löschen?</div>
            </Modal>
              </div>
            <div className="pt-3">Mittels dem folgenden Formular können Sie ein neues Projekt erstellen oder bearbeiten. Im nächsten Schritt können Sie Audiodateien dem Projekt hinzufügen.</div>
          </div>
          <div className="custom-card-body">
            <form role="form" name="create-project-form">
              <div className="form-group">
                <label htmlFor="projectTitle">Titel*</label>
                <input value={projectFormValues.projectTitle} onChange={handleChange} type="text" id="projectTitle"
                       className="form-control custom-input custom-input-blue" name="projectTitle"/>
                {projectFormErrors.projectTitle && (
                  <span className="input-error">{projectFormErrors.projectTitle }</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="projectDescription">Beschreibung</label>
                <textarea value={projectFormValues.projectDescription} onChange={handleChange} type="textarea" id="regionDescription"
                          className="form-control custom-input custom-input-blue" rows="6" name="projectDescription"/>
                {projectFormErrors.projectDescription && (
                  <span className="input-error">{projectFormValues.projectDescription}</span>
                )}
              </div>
            </form>
          </div>
          <div className="custom-card-action">
            <div className="d-flex flex-column flex-md-row justify-content-end align-items-end">
              <button onClick={() => { project ? router.push(`/project/${project.id}`) : router.push("/")}} className="custom-button custom-button-sm custom-button-transparent mx-1">Abbrechen</button>
              {project && <button onClick={() => setCurrentStep(2)} className="custom-button custom-button-sm custom-button-blue my-2 my-md-0 mx-1 mx-md-3">Aufnahmen verwalten</button>}
              {!project && <button onClick={handleSubmitCreate} className="custom-button custom-button-sm custom-button-orange mx-1">
                Projekt erstellen
              </button>}
              {project && <button disabled={!projectDataChanged} onClick={handleSubmitUpdate} className="custom-button custom-button-sm custom-button-orange">
                Projekt aktualisieren
              </button>}
            </div>
          </div>
        </div>}
        {currentStep === 2 && <div className="fadeInEffect custom-card">
          <div className="custom-card-header">
            <div className="custom-card-title text-uppercase">Dateien hochladen</div>
            <div className="pt-2">Laden Sie Audiodateien in Ihr Projekt hoch. Dies kann auch zu einem späteren Zeitpunkt erfolgen.</div>
          </div>
          <div className="custom-card-body">
            <UploadFileDropzone/>
          </div>
          <div className="custom-card-action">
          </div>
        </div>}
      </div>
    </React.Fragment>
  )
};

export default AddEditProjectForm;
