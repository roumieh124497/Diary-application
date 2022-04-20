import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import MainNavigation from './Layouts/MainNavigation';
import classes from './InboxDiary.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
const InboxDiary = ({ socket }) => {
  const [diaries, setDiaries] = useState([]);
  const [inboxes, setInboxes] = useState([]);
  const [oneDiary, setOneDiary] = useState({});
  const [oneInbox, setOneInbox] = useState({});

  const cookies = new Cookies();
  const user = cookies.get('user-info');
  useEffect(() => {
    async function getDiary() {
      const data = await axios.post('/api/inbox/get-inbox', {
        email: user.email,
      });
      setInboxes(data.data.inboxes);
    }
    getDiary();
  }, []);

  useEffect(() => {
    socket?.emit('userEmail', user?.email);
  }, [socket, user]);

  useEffect(() => {
    socket?.on('sendDiary', data => {
      setDiaries(prev => [data, ...prev]);
    });
  }, [socket]);

  let i = 0;
  let j = 0;
  useEffect(() => {
    document.title = 'Inbox - Diaries :)';
  }, []);

  const closeCartHandler = async e => {
    const diaryCart = document.getElementById('diaryCartContainerId');
    const viewButton = document.getElementById('viewButtonID');
    diaryCart.style.marginTop = '-500px';
    diaryCart.style.opacity = '0';
    const id = viewButton.lastElementChild.value;
    try {
      await axios.get(`/api/inbox/update-inbox/${id}`);
    } catch (err) {
      toast.error('Something went very wrong 😥!');
    }
    window.location.reload();
  };

  const viewDIaryHandler = async e => {
    try {
      const id = e.target.firstElementChild.value;
      const data = await axios.post('/api/diary/get-one-diary', {
        id,
      });
      setOneDiary(data.data.diary);
      const diaryCart = document.getElementById('diaryCartContainerId');
      diaryCart.style.marginTop = '180px';
      diaryCart.style.opacity = '1';
    } catch (err) {
      console.log(err.response);
    }
  };
  //   inbox part with no socket
  const showInboxHandlerCart = async e => {
    const diaryCart = document.getElementById('diaryCartContainerIdInbox');
    const id = e.target.firstElementChild.value;
    try {
      const data = await axios.get(`/api/inbox/get-inbox-one/${id}`);
      setOneInbox(data.data.inbox);
      diaryCart.style.marginTop = '180px';
      diaryCart.style.opacity = '1';
    } catch (err) {
      console.log(err);
      // toast.error('Something went very wrong 😞!');
    }
  };
  const closeCartHandlerInbox = async e => {
    const diaryCart = document.getElementById('diaryCartContainerId');
    diaryCart.style.marginTop = '-500px';
    diaryCart.style.opacity = '0';

    const id = e.target.firstElementChild.value;

    try {
      await axios.get(`/api/inbox/update-inbox/${id}`);
    } catch (err) {
      toast.error('Something went wrong 😥!');
    }
    window.location.reload();
  };
  return (
    <>
      <div id="diaryCartContainerId" className={classes.diaryCartContainer}>
        <div className={classes.diaryCartHeaderContainer}>
          <h4>{oneDiary.title}</h4>
          <h2>
            {oneDiary.feeling === 'happy'
              ? '😄'
              : oneDiary.feeling === 'love'
              ? '😍'
              : oneDiary.feeling === 'dizy'
              ? '😵'
              : oneDiary.feeling === 'sad'
              ? '😞'
              : oneDiary.feeling === 'no-expression'
              ? '😑'
              : ''}
          </h2>
        </div>
        <div className={classes.diaryCartBodyContainer}>
          <p>{oneDiary.diary}</p>
        </div>
        <div className={classes.diaryCartFooterContainer}>
          <h4>{oneDiary.date}</h4>
          <button onClick={closeCartHandler}>Close</button>
        </div>
      </div>
      {/* setInboxes */}

      <div
        id="diaryCartContainerIdInbox"
        className={classes.diaryCartContainer}
      >
        <div className={classes.diaryCartHeaderContainer}>
          <h4>{oneInbox?.diary?.title}</h4>
          <h2>
            {oneInbox?.diary?.feeling === 'happy'
              ? '😄'
              : oneInbox?.diary?.feeling === 'love'
              ? '😍'
              : oneInbox?.diary?.feeling === 'dizy'
              ? '😵'
              : oneInbox?.diary?.feeling === 'sad'
              ? '😞'
              : oneInbox?.diary?.feeling === 'no-expression'
              ? '😑'
              : ''}
          </h2>
        </div>
        <div className={classes.diaryCartBodyContainer}>
          <p>{oneInbox?.diary?.diary}</p>
        </div>
        <div className={classes.diaryCartFooterContainer}>
          <h4>{oneInbox?.diary?.date}</h4>
          <button onClick={closeCartHandlerInbox}>
            Close
            <input type="hidden" value={oneInbox?._id || ''} />
          </button>
        </div>
      </div>

      <MainNavigation socket={socket} />
      <div className={classes.mainDiaryContainer}>
        <div className={classes.diaryHeader}>
          <h3>Diary Inboxes</h3>
          <img
            src="https://img.icons8.com/plumpy/24/000000/inbox.png"
            alt="inbox"
          />
        </div>
        <div className={classes.diaryInboxesContainer}>
          <ul className={classes.inboxLists}>
            {diaries?.length === 0
              ? ''
              : diaries.map(da => {
                  return (
                    <li className={classes.inboxList} key={i++}>
                      <div className={classes.diaryInboxContainer}>
                        <h3>{da.inbox.senderEmail}</h3>
                        {da.inbox.isRed === false ? (
                          <div
                            style={{
                              width: '120px',
                              height: '40px',
                              background: '#c51162',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px',
                              padding: '4px',
                            }}
                          >
                            Not viewed
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '80px',
                              height: '40px',
                              background: '#76ff03',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px',
                              padding: '4px',
                            }}
                          >
                            Viewed
                          </div>
                        )}
                        <div>
                          <button onClick={viewDIaryHandler} id="viewButtonID">
                            View
                            <input type="hidden" value={da.inbox.diary._id} />
                            <input type="hidden" value={da.inbox._id} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
            {inboxes?.length === 0
              ? ''
              : inboxes
                  .slice(0)
                  .reverse()
                  .map(da => {
                    return (
                      <li className={classes.inboxList} key={j++}>
                        <div className={classes.diaryInboxContainer}>
                          <h3>{da.senderEmail}</h3>
                          {da.isRed === false ? (
                            <div
                              style={{
                                width: '120px',
                                height: '40px',
                                background: '#c51162',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                padding: '4px',
                              }}
                            >
                              Not viewed
                            </div>
                          ) : (
                            <div
                              style={{
                                width: '80px',
                                height: '40px',
                                background: '#76ff03',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                padding: '4px',
                              }}
                            >
                              Viewed
                            </div>
                          )}
                          <div>
                            <button onClick={showInboxHandlerCart}>
                              View
                              <input type="hidden" value={da._id} />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default InboxDiary;
