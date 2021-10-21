import Head from "next/head";
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import {projectService} from "../../services";

const CreateProject = () => {
  const router = useRouter();
  const [projectFormValues, setProjectFormValues] = useState({
    projectTitle: "",
    projectDescription: ""
  });
  const [projectFormErrors, setProjectFormErrors] = useState({});
  const [projectCreated, setProjectCreated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = () => {
    projectService.createProject({
      name: projectFormValues.projectTitle,
      description: projectFormValues.projectDescription
    }).then((createdProject) => {
      console.log("SUCCESS")
      setProjectCreated(true);
    });
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setProjectFormValues({...projectFormValues, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProjectFormErrors(validate(projectFormValues));
    setIsSubmitting(true);
  };

  const validate = (values) => {
    let errors = {};
    if (!values.projectTitle) {
      errors.projectTitle = "Titel darf nicht leer sein!";
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(projectFormErrors).length === 0 && isSubmitting) {
      console.log("SUBMIT")
      submitForm();
    }
  }, [projectFormErrors]);

  return (
    <React.Fragment>
      <Head>
        <title>Projekt erstellen</title>
      </Head>
      <div className="main-container d-flex flex-column">
        {!projectCreated && <div className="custom-card">
          <div className="custom-card-header">
            <div className="custom-card-title text-uppercase">Projekt erstellen</div>
          </div>
          <div className="custom-card-body">
            <form role="form" name="create-project-form">
              <div className="form-group">
                <label htmlFor="projectTitle">Titel</label>
                <input value={projectFormValues.projectTitle} onChange={handleChange} type="text" id="projectTitle"
                       className="form-control custom-input custom-input-blue" name="projectTitle"/>
                {projectFormErrors.projectTitle && (
                  <span className="input-error">{projectFormErrors.projectTitle }</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="projectDescription">Beschreibung</label>
                <textarea value={projectFormValues.projectDescription} onChange={handleChange} type="textarea" id="regionDescription"
                          className="form-control custom-input custom-input-blue" rows="4" name="projectDescription"/>
                {projectFormErrors.projectDescription && (
                  <span className="input-error">{projectFormValues.projectDescription}</span>
                )}
              </div>
            </form>
            </div>
          <div className="custom-card-action">
            <div className="d-flex flex-row justify-content-end">
              <button onClick={() => onCancel()} className="custom-button custom-button-sm custom-button-transparent">Abbrechen</button>
              <button onClick={handleSubmit} className="custom-button custom-button-sm custom-button-orange">
                Projekt erstellen
              </button>
            </div>
          </div>
          </div>}
        {projectCreated && <div className="custom-card">
          <div className="custom-card-header">
            <div className="custom-card-title text-uppercase">Dateien hochladen</div>
            <div className="py-2">Laden Sie Audiodateien in Ihr Projekt hoch. Dies kann auch zu einem späteren Zeitpunkt erfolgen.</div>
          </div>
          <div className="custom-card-body">
          </div>
          <div className="custom-card-action">
            <div className="d-flex flex-row justify-content-end">
              <button onClick={() => router.push("/")} className="custom-button custom-button-sm custom-button-transparent">Dateien Später hochladen</button>
              <button onClick={handleSubmit} className="custom-button custom-button-sm custom-button-orange">
                Dateien speichern
              </button>
            </div>
          </div>
        </div>}
        </div>
    </React.Fragment>
  )
};

export default CreateProject;
