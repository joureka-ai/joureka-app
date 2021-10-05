import styles from "../styles/login.module.scss"
import React from "react";
import Logo from "../../public/logo.png"
import Image from "next/image";
import { userService } from "../services";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const LogIn = () => {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Benutzername ist erforderlich!'),
    password: Yup.string().required('Passwort ist erforderlich!')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setError, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ username, password }) {
    return userService.login(username, password)
      .then(() => {
        // get return url from query parameters or default to '/'
        router.push("/");
      })
      .catch(error => {
        setError('apiError', { message: error });
      });
  }

  return (
    <div>
      <div className={`${styles.split} ${styles.left}`}>
        <div className='d-flex justify-content-center align-items-center flex-column flex-md-row'>
          <div className='mb-3'>
            <Image src={Logo} alt="Picture of the author" />
          </div>
          <div className='p-5'><h3>Mit mehr Muße<br/>vom Interview<br/>zum Artikel!</h3></div>
        </div>
      </div>

      <div className={`${styles.split} ${styles.right}`}>
        <div className='d-flex justify-content-center align-items-center flex-column flex-md-row'>
          <div className='form-container p-1'>
            <h2 className='mb-5'>Anmelden</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Benutzername</label>
                <input name="username" type="text" {...register('username')} className={`form-control custom-input-blue full-width ${errors.username ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.username?.message}</div>
              </div>
              <div className="form-group">
                <label>Passwort</label>
                <input name="password" type="password" {...register('password')} className={`form-control custom-input-blue full-width ${errors.password ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.password?.message}</div>
              </div>
              <div className="d-flex flex-row justify-content-end">
                <button disabled={formState.isSubmitting} className="custom-button custom-button-orange">
                  {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"/>}
                  Anmelden
                </button>
              </div>
              {errors.apiError &&
              <div className="alert alert-danger mt-3 mb-0">Benutzername oder Passwort ist falsch!</div>
              }
            </form>
            {/*<div className='pt-4'><span>Du hast kein Konto? <b>Melde dich an.</b></span></div-->*/}
          </div>
        </div>
      </div>
    </div>
  )
};
export default LogIn;
