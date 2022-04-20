import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import classes from './Login.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = 'Login - Page :)';
  }, []);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const loginHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/login', {
        email,
        password,
      });
      cookies.set('user-info', response.data.user);
      setError(null);
      setLoading(false);
      toast(`Welcome ${response.data.user.fullName} 😄!`, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/all-diaries');
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
            }}
          >
            <h2>Login</h2>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Your email"
              onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Your password"
              onChange={e => setPassword(e.target.value)}
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
              <button onClick={loginHandler}>Login</button>
            )}

            <p>
              Do not have an account <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
