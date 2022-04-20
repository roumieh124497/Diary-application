import React, { useEffect, useState } from 'react';
import classes from './MainNavigation.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
const MainNavigation = ({ socket }) => {
  const [toggle, setToggle] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [onlineNotification, setOnlineNotification] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const cookies = new Cookies();
  const user = cookies.get('user-info');

  const navigate = useNavigate();
  const dropDownHandler = () => {
    const dropDown = document.getElementById('dropDownContainerId');
    const dropDown1 = document.getElementById('dropDownDiaryContainerId');
    const notification = document.getElementById('notificationDropDownID');
    if (toggle === false) {
      dropDown.style.opacity = '1';
      dropDown.style.marginTop = '80px';
      setToggle(true);
      dropDown1.style.opacity = '0';
      dropDown1.style.marginTop = '-500px';
      setToggle1(false);
      notification.style.top = '-500px';
      notification.style.opacity = '0';
      setToggle2(false);
    } else {
      dropDown.style.opacity = '0';
      dropDown.style.marginTop = '-500px';
      setToggle(false);
    }
  };

  const dropDownDiaryHandler = () => {
    const dropDown = document.getElementById('dropDownDiaryContainerId');
    const dropDown1 = document.getElementById('dropDownContainerId');
    const notification = document.getElementById('notificationDropDownID');
    if (toggle1 === false) {
      dropDown.style.opacity = '1';
      dropDown.style.marginTop = '80px';
      setToggle1(true);
      dropDown1.style.opacity = '0';
      dropDown1.style.marginTop = '-500px';
      setToggle(false);
      notification.style.top = '-500px';
      notification.style.opacity = '0';
      setToggle2(false);
    } else {
      dropDown.style.opacity = '0';
      dropDown.style.marginTop = '-500px';
      setToggle1(false);
    }
  };
  const logoutHandler = () => {
    cookies.remove('user-info', { path: '*' });
    navigate('/login');
  };
  const showNotificationHandler = () => {
    const dropDown = document.getElementById('dropDownDiaryContainerId');
    const dropDown1 = document.getElementById('dropDownContainerId');
    const notification = document.getElementById('notificationDropDownID');

    if (toggle2 === false) {
      notification.style.top = '90px';
      notification.style.opacity = '1';
      setToggle2(true);
      dropDown.style.opacity = '0';
      dropDown.style.marginTop = '-500px';
      setToggle1(false);
      dropDown1.style.opacity = '0';
      dropDown1.style.marginTop = '-500px';
      setToggle(false);
    } else {
      notification.style.top = '-500px';
      notification.style.opacity = '0';
      setToggle2(false);
    }
  };
  useEffect(() => {
    socket?.on('sendNotification', data => {
      setOnlineNotification(prev => [data, ...prev]);
    });
  }, [socket]);
  useEffect(() => {
    async function getNotifications() {
      const data = await axios.post('/api/notification/get-notification', {
        email: user.email,
      });
      setNotifications(data.data.notifications);
    }
    getNotifications();
  }, []);

  const viewNotificationHandler = async e => {
    const id = e.target.lastElementChild.value;
    try {
      await axios.get(`/api/notification/update-notification/${id}`);
      window.location.reload();
    } catch (err) {
      toast.error('Something went very wrong 😞!');
    }
  };

  const notificationCounter = onlineNotification.length + notifications.length;

  return (
    <>
      <div id="notificationDropDownID" className={classes.notificationDropDown}>
        {notificationCounter === 0 ? (
          <div>You have no notifications</div>
        ) : (
          onlineNotification.map(notif => {
            return (
              <div key={notif._id}>
                You have a diary from <span>{notif.senderEmail}</span>
                <button
                  className={classes.removeNotificationButton}
                  onClick={viewNotificationHandler}
                >
                  {/* <img
                    src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/000000/external-cross-essentials-tanah-basah-glyph-tanah-basah.png"
                    alt="cross"
                  /> */}
                  Remove
                  <input type="hidden" value={notif?._id || ''} />
                </button>
              </div>
            );
          })
        )}
        {notifications
          .slice(0)
          .reverse()
          .map(notif => {
            return (
              <div key={notif._id}>
                You have a diary from <span>{notif.senderEmail}</span>
                <button
                  className={classes.removeNotificationButton}
                  onClick={viewNotificationHandler}
                >
                  {/* <img
                    src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/000000/external-cross-essentials-tanah-basah-glyph-tanah-basah.png"
                    alt="cross"
                  /> */}
                  Remove
                  <input type="hidden" value={notif?._id || ''} />
                </button>
              </div>
            );
          })}
      </div>
      <div
        id="dropDownDiaryContainerId"
        className={classes.dropDownDiaryContainer}
      >
        <ul className={classes.dropDownDiaryList}>
          <li>
            <Link
              to="/new-diary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <img
                src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-vitaly-gorbachev/60/000000/external-diary-love-vitaliy-gorbachev-lineal-vitaly-gorbachev.png"
                alt="diary"
                style={{ width: '30px', height: '30px' }}
              />{' '}
              New Diary
            </Link>
          </li>
          <li>
            <Link
              to="/all-diaries"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <img
                src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-vitaly-gorbachev/60/000000/external-diary-valentines-day-vitaliy-gorbachev-lineal-vitaly-gorbachev.png"
                alt="diary"
                style={{ width: '30px', height: '30px' }}
              />{' '}
              Your Diaries
            </Link>
          </li>
          <li>
            <Link
              to="/inbox-diary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <img
                src="https://img.icons8.com/ios-glyphs/30/000000/send-package.png"
                alt="inbox"
                style={{ width: '30px', height: '30px' }}
              />{' '}
              Diaries Inbox
            </Link>
          </li>
        </ul>
      </div>

      <div id="dropDownContainerId" className={classes.dropDownContainer}>
        <ul>
          <li>
            <Link
              to="/setting"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <img
                src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-setting-basic-ui-elements-flatart-icons-outline-flatarticons.png"
                alt="setting"
                style={{ width: '30px', height: '30px' }}
              />
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={logoutHandler}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <img
                src="https://img.icons8.com/material-rounded/24/000000/exit.png"
                alt="logout"
                style={{ width: '30px', height: '30px' }}
              />{' '}
              Logout
            </button>
          </li>
        </ul>
      </div>
      <header className={classes.header}>
        <nav className={classes.nav}>
          <ul className={classes.navLists}>
            <li className={classes.navList}>
              <img src="/logodiary.png" alt="logo" />
            </li>

            <li className={classes.navList}>
              <ul>
                <li>
                  <button
                    style={{
                      position: 'relative',
                    }}
                    onClick={showNotificationHandler}
                  >
                    <img
                      className={classes.myNotification}
                      src="https://img.icons8.com/ios-filled/50/000000/appointment-reminders--v1.png"
                      alt="notification"
                    />
                    {notificationCounter === 0 ? (
                      ''
                    ) : (
                      <span
                        style={{
                          background: 'red',
                          position: 'absolute',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'white',
                          top: '-10px',
                          left: '14px',
                        }}
                      >
                        {notificationCounter}
                      </span>
                    )}
                  </button>
                </li>

                <li>
                  <button onClick={dropDownDiaryHandler}>
                    Diary App{' '}
                    <img
                      src="https://img.icons8.com/plumpy/24/000000/expand-arrow.png"
                      alt="arrow"
                    />
                  </button>
                </li>
                <li>
                  <button onClick={dropDownHandler}>
                    {user.image ? (
                      <img
                        className={classes.myImage}
                        alt="profile"
                        src={`/${user.image}`}
                      />
                    ) : (
                      <img
                        className={classes.myImage}
                        src="/empty.png"
                        alt="empty"
                      />
                    )}
                    <span className={classes.nameUser}>{user.fullName}</span>{' '}
                    <img
                      src="https://img.icons8.com/plumpy/24/000000/expand-arrow.png"
                      alt="arrow"
                    />
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default MainNavigation;
