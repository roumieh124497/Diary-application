import React, { useState, useEffect } from 'react';
import MainNavigation from './Layouts/MainNavigation';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import Cookies from 'universal-cookie';
import classes from './Setting.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Setting = ({ socket }) => {
  const [profileState, setProfileState] = useState(true);
  const [accountState, setAccountState] = useState(false);
  const [profileColor, setProfileColor] = useState(true);
  const [accountColor, setAccountColor] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state);

  const cookies = new Cookies();
  const navigate = useNavigate();
  const profileButtonHandler = () => {
    setProfileState(true);
    setAccountState(false);
    setProfileColor(true);
    setAccountColor(false);
  };
  const accountButtonHandler = () => {
    setProfileState(false);
    setAccountState(true);
    setProfileColor(false);
    setAccountColor(true);
  };

  const user = cookies.get('user-info');
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userInfo = await axios.get(`/api/user-info/${user._id}`);
        dispatch({ type: 'changeUserInfo', payload: userInfo.data.user });
      } catch (err) {
        console.log(err);
      }
    }
    setEmail(user.email);
    setFullName(user.fullName);
    fetchUserInfo();
  }, []);

  const updateProfileHandler = async e => {
    e.preventDefault();
    try {
      if (fullName === '' || email === '') {
        return setError('Please fill all fields 😁!');
      }
      setLoading(true);
      const updatedUser = await axios.patch(`/api/update-user/${user._id}`, {
        email,
        fullName,
      });

      cookies.set('user-info', updatedUser.data.updatedUser);
      setLoading(false);
      toast.success('Your account updated successfully 😄!');
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    document.title = 'Setting - Page :)';
  }, []);

  const changeImageHandler = async e => {
    e.preventDefault();
    try {
      if (!profileImage) return setError('Please upload a photo 😁!');
      setLoading1(true);
      const formData = new FormData();
      formData.append('profile', profileImage);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      const imageUpdated = await axios.post(
        `/api/change-image/${user._id}`,
        formData,
        config,
      );
      cookies.set('user-info', imageUpdated.data.updatedUser);
      toast.success('You changed your profile image successfully 😍!');
      setLoading1(false);
    } catch (err) {
      setLoading1(false);
    }
  };
  const deleteAccountButtonHandler = async () => {
    const user = cookies.get('user-info');
    if (!window.confirm('are sure you want to delete your account')) {
      return;
    }
    await axios.delete(`/api/delete-account/${user._id}`);
    cookies.remove('user-info', { path: '*' });
    navigate('/login');
  };

  const updatePasswordHandler = async e => {
    e.preventDefault();
    try {
      setLoading3(true);
      const updatedUser = await axios.patch(
        `/api/change-password/${user._id}`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
      );
      cookies.set('user-info', updatedUser.data.updatedUser);
      toast.success('Your password updated successfully 😃!');
      setLoading3(false);
      setError1(null);
    } catch (err) {
      setError1(err.response.data.message);
      setLoading3(false);
    }
  };
  useEffect(() => {
    socket?.emit('userEmail', user?.email);
  }, [socket, user]);
  return (
    <>
      {error
        ? toast.error(error, {
            position: 'top-center',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        : null}
      <MainNavigation socket={socket} />
      <div className={classes.MessageBoxMainContainer}>
        <div className={classes.titleIconContainer}>
          <img
            src="https://img.icons8.com/doodle/48/000000/apple-settings.png"
            alt="setting"
          />
          <h2>App Setting</h2>
        </div>
        <div className={classes.profileAccountSettingMainContainer}>
          <div className={classes.btnsContainer}>
            <button
              onClick={profileButtonHandler}
              style={{
                background: profileColor ? 'salmon' : 'rgb(252, 93, 76)',
                color: 'black',
              }}
            >
              Profile setting
            </button>
            <button
              onClick={accountButtonHandler}
              style={{
                background: accountColor ? 'salmon' : 'rgb(252, 93, 76)',
                color: 'black',
              }}
            >
              Account setting
            </button>
          </div>
          <div className={classes.settingContainer}>
            <div
              style={{ display: profileState ? 'block' : 'none' }}
              className={classes.formContainer}
            >
              <form>
                <div className={classes.imageContainer}>
                  {user.image ? (
                    <img alt="profile" src={`/${user.image}`} />
                  ) : (
                    <img src="/empty.png" alt="empty" />
                  )}

                  <TextField
                    sx={{
                      width: '220px',
                    }}
                    type="file"
                    name="profile"
                    onChange={e => setProfileImage(e.target.files[0])}
                  />
                  {loading1 ? (
                    <img
                      src="/loading.gif"
                      style={{
                        width: '70px',
                        height: '70px',
                      }}
                      alt="loading "
                    />
                  ) : (
                    <Button
                      sx={{ background: 'rgb(213, 93, 76)', color: 'black' }}
                      type="submit"
                      onClick={changeImageHandler}
                    >
                      Change Image
                    </Button>
                  )}
                </div>
                <div className={classes.textFieldContainer}>
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    style={{
                      padding: '12px',
                      borderStyle: 'none',
                      borderRadius: '3px',
                      outlineColor: 'rgb(252, 93, 76)',
                    }}
                    id="fullname"
                    type="text"
                    defaultValue={userInfo.fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className={classes.inputFieldFullName}
                  />
                  <label htmlFor="email">Email</label>
                  <input
                    style={{
                      padding: '12px',
                      borderStyle: 'none',
                      borderRadius: '3px',
                      outlineColor: 'rgb(252, 93, 76)',
                    }}
                    id="email"
                    type="email"
                    defaultValue={userInfo.email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    className={classes.inputFieldFullName}
                  />

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
                    <Button
                      sx={{ background: 'rgb(213, 93, 76)', color: 'black' }}
                      type="submit"
                      onClick={updateProfileHandler}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </form>
            </div>
            <div
              className={classes.deleteAcountContainer}
              style={{ display: accountState ? 'flex' : 'none' }}
            >
              <Typography variant="h5">Delete Account:</Typography>
              <Typography variant="p">
                Deleting your account will remove your information and data,
                unfortunately you can not recove your account, so make sure
                before deleting.
              </Typography>
              <Button
                sx={{ background: '#d32f2f', width: '100px', color: 'white' }}
                onClick={deleteAccountButtonHandler}
              >
                Delete
              </Button>
              <hr style={{ background: 'white', borderTopStyle: 'none' }} />
              <Typography variant="h5">Change Password:</Typography>
              {error1 ? (
                <div
                  style={{
                    background: 'rgb(252, 93, 76)',
                    width: '80%',
                    padding: '7px',
                    borderRadius: '4px',
                    textAlign: 'center',
                  }}
                >
                  {error1}
                </div>
              ) : (
                ''
              )}

              <label htmlFor="currentPassword">Current Password</label>
              <input
                className={classes.changePassowrdInputs}
                style={{}}
                id="currentPassword"
                type="password"
                placeholder="Current Password"
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <label htmlFor="newPassword">New Password</label>
              <input
                className={classes.changePassowrdInputs}
                id="newPassword"
                type="password"
                placeholder="New Password"
                onChange={e => setNewPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className={classes.changePassowrdInputs}
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {loading3 ? (
                <img
                  src="/loading.gif"
                  style={{
                    width: '70px',
                    height: '70px',
                  }}
                  alt="loading "
                />
              ) : (
                <Button
                  sx={{
                    background: 'rgb(213, 93, 76)',
                    color: 'black',
                    width: '110px',
                  }}
                  onClick={updatePasswordHandler}
                >
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
