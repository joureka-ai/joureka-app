import styles from "../styles/login.module.scss"
import React, {useEffect, useState} from "react";
import Head from "next/head";
import { userService } from "../services";
import { useRouter } from "next/router";

const LogIn = () => {
  const router = useRouter();

  const [loginFormValues, setLoginFormValues] = useState({
    username: "",
    password: ""
  });
  const [loginFormErrors, setLoginFormErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);


  const handleChange = (e) => {
    const {name, value} = e.target;
    setLoginFormValues({...loginFormValues, [name]: value});
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    setLoginFormErrors(validate(loginFormValues));
    setIsSubmittingLogin(true);
  };

  const validate = (values) => {
    let errors = {};
    if (values.username == "") {
      errors.username = "Username darf nicht leer sein!";
    }
    if (values.password == "") {
      errors.password = "Passwort darf nicht leer sein!";
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(loginFormErrors).length === 0 && isSubmittingLogin) {
      submitLogin();
    } else {       
      setIsSubmittingLogin(false);
    }
  }, [loginFormErrors]);

  const submitLogin = () => {
    return userService.login(loginFormValues.username, loginFormValues.password)
      .then(() => {
        setIsSubmittingLogin(false)
        router.push("/");
      }).catch(error => {
        setLoginError("Eingegebener Nutzername oder Passwort ist falsch.");
        setIsSubmittingLogin(false)
      })
  }

  return (
    <React.Fragment>
      <Head>
        <title>joureka - Login</title>
      </Head>      
      <div className={`${styles.split} ${styles.left}`}>
        <div className='d-flex justify-content-center align-items-center flex-column flex-md-row'>
          <div className='mb-3'>
            <img src="/logo.png" alt="Picture of the author" />
          </div>
          <div className='p-5'><h3>Mit mehr Muße<br/>vom Interview<br/>zum Artikel!</h3></div>
        </div>
      </div>
      <div className={`${styles.split} ${styles.right}`}>
        <div className='d-flex justify-content-center align-items-center flex-column flex-md-row'>
          <div className={`${styles.logoMobile} justify-content-center align-items-center flex-column flex-md-row`}>
            <div className='mb-3'>
              <img src="/logo.png" alt="Picture of the author" />
            </div>
          </div>
          <div className='form-container p-1'>
            <h2 className='mb-5'>Anmelden</h2>
            <form role="form" name="login-form">
              <div className="form-group">
                <label>Benutzername</label>
                <input value={loginFormValues.username} onChange={handleChange} type="text" id="username"
                       className="form-control custom-input custom-input-blue" name="username"/>
                {loginFormErrors.username && (
                  <span className="input-error">{loginFormErrors.username}</span>
                )}
              </div>
              <div className="form-group">
                <label>Passwort</label>
                <input value={loginFormValues.password} onChange={handleChange} type="password" id="password"
                       className="form-control custom-input custom-input-blue" name="password"/>
                {loginFormErrors.password && (
                  <span className="input-error">{loginFormErrors.password}</span>
                )}
              </div>
              {loginError && (
                  <span className="input-error">{loginError}</span>
              )}
              <div className="d-flex flex-row justify-content-end">
                <button onClick={handleSubmitLogin} disabled={isSubmittingLogin} className="custom-button custom-button-orange mt-3">
                  {isSubmittingLogin && <span className="spinner-border spinner-border-sm mr-1"/>}
                  Anmelden
                </button>
              </div>
            </form>
            {/*<div className='pt-4'><span>Du hast kein Konto? <b>Melde dich an.</b></span></div-->*/}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
};
export default LogIn;
