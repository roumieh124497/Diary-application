import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './Signup.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPasssword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Signup - Page :)';
  }, []);
  const submitFormHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/signup', {
        fullName: fullname,
        email: email,
        password: password,
        confirmPassword: confirmPasssword,
      });

      setLoading(false);
      toast.success('Thank you for being one of us 😘!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };
  return (
    <>
      <div className={classes.container}>
        <form className={classes.form}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              margin: '0 auto',
              gap: '12px',
            }}
          >
            <h2>Signup</h2>
            <img
              src="/logodiary.png"
              style={{
                width: '55px',
                height: '55px',
              }}
              alt="diary logo"
            />
          </div>
          {error ? (
            <div
              style={{
                margin: '0 auto',
                background: '#ff1744',
                padding: '5px',
                width: '70%',
                textAlign: 'center',
                fontWeight: '700',
              }}
            >
              {error}
            </div>
          ) : (
            ''
          )}
          <div className={classes.inputContainer}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              onChange={e => setFullname(e.target.value)}
            />
            <label htmlFor="email">email</label>
            <input
              type="email"
              id="email"
              placeholder="email"
              onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder=" Password"
              onChange={e => setPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className={classes.btns}>
            {loading ? (
              <img
                src="/loading.gif"
                style={{
                  width: '70px',
                  height: '70px',
                }}
                alt="loading "
              />
            ) : (
              <button onClick={submitFormHandler}>Sign up</button>
            )}

            <p>
              You already have an account <Link to="/Login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
