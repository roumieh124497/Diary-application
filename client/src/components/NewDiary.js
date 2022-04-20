import React, { useState, useEffect } from 'react';
import MainNavigation from './Layouts/MainNavigation';
import classes from './NewDiary.module.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import 'draft-js/dist/Draft.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewDiary = ({ socket }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [diary, setDiary] = useState('');
  const [feeling, setFeeling] = useState('default');
  const [loading, setLoading] = useState(false);
  const cookies = new Cookies();

  const user = cookies.get('user-info');

  const showAddDiaryContainerHandler = () => {
    const diaryContainer = document.getElementById('addDiaryContainerId');
    diaryContainer.style.marginTop = '120px';
    diaryContainer.style.opacity = '1';
  };
  const closeAddDiaryHandler = () => {
    const diaryContainer = document.getElementById('addDiaryContainerId');
    diaryContainer.style.marginTop = '-530px';
    diaryContainer.style.opacity = '0';
  };

  const addDiaryHandler = async e => {
    e.preventDefault();
    const diaryContainer = document.getElementById('addDiaryContainerId');
    try {
      setLoading(true);
      await axios.post(`/api/diary/add-diary/${user._id}`, {
        title,
        date,
        diary,
        feeling,
      });
      setLoading(false);
      setTitle('');
      setDate('');
      setFeeling('default');
      setDiary('');
      diaryContainer.style.marginTop = '-230px';
      diaryContainer.style.opacity = '0';
      toast.success('You added a diary 📔!');
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    socket?.emit('userEmail', user?.email);
  }, [socket, user]);
  useEffect(() => {
    document.title = 'New - Diary :)';
  }, []);
  return (
    <>
      <div id="addDiaryContainerId" className={classes.addDiaryContainer}>
        <button className={classes.closeButton} onClick={closeAddDiaryHandler}>
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
              onChange={e => setTitle(e.target.value)}
              value={title}
            />
            <input
              type="date"
              onChange={e => setDate(e.target.value)}
              value={date}
            />
          </div>
          <div className={classes.feelingTextContainer}>
            <select
              placeholder="Feeling"
              onChange={e => setFeeling(e.target.value)}
              value={feeling}
            >
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
              onChange={e => setDiary(e.target.value)}
              value={diary}
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
              <button onClick={addDiaryHandler}>Add</button>
            )}
          </div>
        </form>
      </div>
      <MainNavigation socket={socket} />
      <div className={classes.mainDiaryContainer}>
        <button
          className={classes.addDiaryButton}
          onClick={showAddDiaryContainerHandler}
        >
          <img
            src="https://img.icons8.com/plasticine/100/000000/add--v1.png"
            alt="add"
            style={{ width: '120px', height: '120px' }}
          />{' '}
          Press to add a new diary.
        </button>
      </div>
    </>
  );
};

export default NewDiary;
