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
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
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
          <div className='form-container'>
            <h2 className='mb-5'>Log In</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Username</label>
                <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.username?.message}</div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.password?.message}</div>
              </div>
              <button disabled={formState.isSubmitting} className="btn btn-primary">
                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                Login
              </button>
              {errors.apiError &&
              <div className="alert alert-danger mt-3 mb-0">{errors.apiError?.message}</div>
              }
            </form>
            <div className='pt-4'><span>Du hast kein Konto? <b>Melde dich an.</b></span></div>
          </div>
        </div>
      </div>
    </div>
  )
};

/*const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function submit(event) {
    console.log('SUBMIT');
    event.preventDefault();
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
          <div className='form-container'>
            <h2 className='mb-5'>Log In</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Benutzername/E-Mail Adresse</label>
                <input type="email" onChange={(e) => setEmail(e.target.value)} className="custom-input" id="exampleInputEmail1" value={email} aria-describedby="emailHelp"/>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Passwort</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} className="custom-input"  id="exampleInputPassword1" value={password}/>
              </div>
              <div className='d-flex justify-content-end'>
                <button type="submit" className="custom-button custom-button-orange left" disabled={!validateForm()}>Submit</button>
              </div>
            </form>
            <div className='pt-4'><span>Du hast kein Konto? <b>Melde dich an.</b></span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
*/
export default LogIn;
