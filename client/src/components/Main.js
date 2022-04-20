import React, { useState, useEffect } from 'react';
import classes from './Main.module.css';
import MainNavigation from './Layouts/MainNavigation';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import validator from 'validator';
const Main = ({ socket }) => {
  const [dropDown, setDropDown] = useState('allDiaries');
  const [date, setDate] = useState('');

  const [oneData, setOneData] = useState({});
  const [oneDataEdit, setOneDataEdit] = useState({});
  const [trashData, setTrashData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [screenLoadin, setScreenLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [diary, setDiary] = useState('');
  const [dateEdit, setDateEdit] = useState('');
  const [shareDiary, setShareDiary] = useState({});
  const [receiverDiary, setReceiverDiary] = useState('');
  const cookies = new Cookies();
  const user = cookies.get('user-info');
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const showInputDateHandler = e => {
    const inputDate = document.getElementById('inputDate');
    if (e.target.value === 'searchDiary') {
      inputDate.style.marginTop = '30px';
      inputDate.style.display = 'block';
      setDropDown('searchDiary');
    } else {
      inputDate.style.marginTop = '0px';
      inputDate.style.display = 'none';
      setDropDown('allDiaries');
    }
  };
  useEffect(() => {
    if (dropDown === 'allDiaries') {
      setScreenLoading(false);
      async function getAllDiaries() {
        const data = await axios.get(`/api/diary/all-diary/${user._id}`);
        setData(data.data.diaries);
        setScreenLoading(true);
      }
      getAllDiaries();
    } else if (dropDown === 'searchDiary' && date !== '') {
      setScreenLoading(false);
      async function getFewDiaries() {
        const data = await axios.post(`/api/diary/get-diary/${user._id}`, {
          date,
        });
        setData(data.data.diaries);
        setScreenLoading(true);
      }
      getFewDiaries();
    }
  }, [dropDown, user._id, date, trashData]);

  // features ////////////////////////
  const showDiaryCartHandler = async e => {
    try {
      const id = e.target.firstElementChild.value;
      const data = await axios.post('/api/diary/get-one-diary', {
        id,
      });
      setOneData(data.data.diary);
      const diaryCart = document.getElementById('diaryCartContainerId');
      diaryCart.style.marginTop = '180px';
      diaryCart.style.opacity = '1';
    } catch (err) {
      console.log(err.response);
    }
  };
  const closeCartHandler = () => {
    const diaryCart = document.getElementById('diaryCartContainerId');
    diaryCart.style.marginTop = '-500px';
    diaryCart.style.opacity = '0';
  };
  const showEditDiaryContainerHandler = async e => {
    const diaryContainer = document.getElementById('addDiaryContainerId');
    diaryContainer.style.marginTop = '220px';
    diaryContainer.style.opacity = '1';
    try {
      const id = e.target.firstElementChild.value;
      const data = await axios.post('/api/diary/get-one-diary', {
        id,
      });
      setOneDataEdit(data.data.diary);
      setTitle(data.data.diary.title);
      setDiary(data.data.diary.diary);
      setDateEdit(data.data.diary.date);
    } catch (err) {
      console.log(err.response);
    }
  };
  const closeEditDiaryHandler = () => {
    const diaryContainer = document.getElementById('addDiaryContainerId');
    diaryContainer.style.marginTop = '-530px';
    diaryContainer.style.opacity = '0';
  };
  const editButtonHandler = async e => {
    e.preventDefault();
    const diaryContainer = document.getElementById('addDiaryContainerId');
    const id = oneDataEdit._id;
    try {
      setLoading(true);
      const data = await axios.post(`/api/diary/edit-diary/${id}`, {
        title,
        date: dateEdit,
        diary,
      });
      setTrashData(data.data.updatedDiary);
      diaryContainer.style.marginTop = '-230px';
      diaryContainer.style.opacity = '0';

      window.location.reload();
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  const deleteDiaryHandler = async e => {
    const id = e.target.firstElementChild.value;
    try {
      setLoading(true);
      if (window.confirm('Are you sure you want to delete your diary 🤔!')) {
        await axios.post(`/api/diary/delete-diary/${id}`);
      }
      setLoading(false);
      window.location.reload();
    } catch (err) {
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };
  // share container
  const showShareHandler = async e => {
    const shareContainer = document.getElementById('shareContainerId');
    shareContainer.style.marginTop = '320px';
    shareContainer.style.opacity = '1';
    const id = e.target.firstElementChild.value;
    try {
      const data = await axios.post('/api/diary/get-one-diary', {
        id,
      });
      setShareDiary(data.data.diary);
    } catch (err) {
      console.log(err.response);
    }
  };

  const closeShareContainerHandler = () => {
    const shareContainer = document.getElementById('shareContainerId');
    shareContainer.style.marginTop = '-90px';
    shareContainer.style.opacity = '0';
  };

  const sendDiaryHandler = async e => {
    const shareContainer = document.getElementById('shareContainerId');
    try {
      setLoading1(true);
      const data = await axios.get('/api/users');
      const isExists = data.data.users.filter(us => {
        return us.email === receiverDiary;
      });

      if (!(isExists?.length > 0)) {
        setLoading1(false);
        return toast.error('We can not find this email 😃!');
      }
      if (receiverDiary === '') {
        setLoading1(false);
        return toast.error("Please write the receiver's email 😄!");
      }
      if (!validator.isEmail(receiverDiary)) {
        setLoading1(false);
        return toast.error('Please write correct email 😄!');
      }
      socket.emit('message', {
        receiverDiary,
        shareDiary,
        senderEmail: user.email,
      });
      shareContainer.style.marginTop = '-90px';
      shareContainer.style.opacity = '0';
      setReceiverDiary('');

      toast.success('You send diary successfully 😄!');
      setLoading1(false);
    } catch (err) {
      toast.error('Something went wrong!');
      setLoading1(false);
    }
  };

  useEffect(() => {
    socket?.emit('userEmail', user?.email);
    document.title = 'Your - Diaries :)';
  }, [socket, user]);

  return (
    <>
      {/* share */}
      <div id="shareContainerId" className={classes.shareContainer}>
        <p>Write the email of the receiver 😄</p>
        <input
          type="email"
          placeholder="Email"
          onChange={e => setReceiverDiary(e.target.value)}
          value={receiverDiary}
        />
        <div className={classes.btn}>
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
            <button onClick={sendDiaryHandler}>Send</button>
          )}
          <button onClick={closeShareContainerHandler}>Cancel</button>
        </div>
      </div>
      {/* edit diary */}
      <div id="addDiaryContainerId" className={classes.addDiaryContainer}>
        <button className={classes.closeButton} onClick={closeEditDiaryHandler}>
          <img
            src="https://img.icons8.com/external-tanah-basah-detailed-outline-tanah-basah/48/000000/external-cross-user-interface-tanah-basah-detailed-outline-tanah-basah.png"
            alt="cross"
          />
        </button>

        <form className={classes.addDiaryForm}>
          <div className={classes.titleDateContainer}>
            <input
              type="text"
              placeholder="Title..."
              defaultValue={oneDataEdit.title}
              onChange={e => setTitle(e.target.value)}
            />
            <input
              type="date"
              defaultValue={oneDataEdit.date}
              onChange={e => setDateEdit(e.target.value)}
            />
          </div>
          <div className={classes.feelingTextContainer}>
            <select placeholder="Feeling" value={oneDataEdit.feeling}>
              <option disabled value="default">
                Feeling
              </option>
              <option value="happy">😄</option>
              <option value="love">😍</option>
              <option value="dizy">😵</option>
              <option value="sad">😞</option>
              <option value="no-expression">😑</option>
            </select>
            <textarea
              placeholder="Start writing your diary...."
              defaultValue={oneDataEdit.diary}
              onChange={e => setDiary(e.target.value)}
            />
            {loading ? (
              <button style={{ padding: '0', background: 'salmon' }}>
                <img
                  src="/loading.gif"
                  style={{
                    width: '70px',
                    height: '70px',
                  }}
                  alt="loading "
                />
              </button>
            ) : (
              <button onClick={editButtonHandler}>Edit</button>
            )}
          </div>
        </form>
      </div>
      {/* view diary */}
      <div id="diaryCartContainerId" className={classes.diaryCartContainer}>
        <div className={classes.diaryCartHeaderContainer}>
          <h4>{oneData.title}</h4>
          <h2>
            {oneData.feeling === 'happy'
              ? '😄'
              : oneData.feeling === 'love'
              ? '😍'
              : oneData.feeling === 'dizy'
              ? '😵'
              : oneData.feeling === 'sad'
              ? '😞'
              : oneData.feeling === 'no-expression'
              ? '😑'
              : ''}
          </h2>
        </div>
        <div className={classes.diaryCartBodyContainer}>
          <p>{oneData.diary}</p>
        </div>
        <div className={classes.diaryCartFooterContainer}>
          <h4>{oneData.date}</h4>
          <button onClick={closeCartHandler}>Close</button>
        </div>
      </div>
      {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
      {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
      {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
      <MainNavigation socket={socket} />
      <div className={classes.allDiaryContainer}>
        <div className={classes.headerContainer}>
          <div className={classes.searchDiaryContainer}>
            <input
              id="inputDate"
              type="date"
              onChange={e => setDate(e.target.value)}
            />
            <select onChange={showInputDateHandler}>
              <option value="allDiaries">All diaries</option>
              <option value="searchDiary">Search diary</option>
            </select>
          </div>
        </div>
        <div className={classes.allDiariesBodyContainer}>
          <ul className={classes.diaryLists}>
            {screenLoadin ? (
              data.length === 0 ? (
                <div className={classes.noDiaryContainer}>
                  <h3>You have no diaries 😅!</h3>
                  <Link to="/new-diary">Add a new diary</Link>
                </div>
              ) : (
                data.map(da => {
                  dispatch({ type: '' });
                  return (
                    <li className={classes.diaryList} key={da._id}>
                      <div className={classes.diaryListContainer}>
                        <h3>{da.title}</h3>
                        <p>{da.date}</p>
                        <div className={classes.btnsContainer}>
                          <button
                            className={classes.viewButton}
                            onClick={showDiaryCartHandler}
                          >
                            View
                            <input type="hidden" value={da._id} />
                          </button>
                          <button
                            className={classes.editButton}
                            onClick={showEditDiaryContainerHandler}
                          >
                            Edit
                            <input type="hidden" value={da._id} />
                          </button>
                          {loading ? (
                            <button
                              style={{ padding: '0', background: 'salmon' }}
                            >
                              <img
                                src="/loading.gif"
                                style={{
                                  width: '70px',
                                  height: '70px',
                                }}
                                alt="loading "
                              />
                            </button>
                          ) : (
                            <button
                              className={classes.deleteButton}
                              onClick={deleteDiaryHandler}
                            >
                              Delete
                              <input type="hidden" value={da._id} />
                            </button>
                          )}

                          <button
                            className={classes.shareButton}
                            onClick={showShareHandler}
                          >
                            Share
                            <input type="hidden" value={da._id} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })
              )
            ) : (
              <img
                src="/loading.gif"
                style={{
                  width: '70px',
                  height: '70px',
                }}
                alt="loading "
              />
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Main;
