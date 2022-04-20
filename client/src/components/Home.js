import React, { useEffect } from 'react';
import classes from './Home.module.css';
import { Link } from 'react-router-dom';
import Navigation from './Layouts/Navigation';

const Home = () => {
  useEffect(() => {
    document.title = 'Welcome - diary app :)';
  }, []);
  return (
    <div>
      <Navigation />
      <div className={classes.container}>
        <img src="/DiaryRou.jpeg" alt="diary" />

        <div className={classes.aboutContainer}>
          <h2>Diary Application</h2>
          <p>
            Do you like to write your story each single day?, DiaryRou is a
            website, that makes it easy to you to write your diaries and keep it
            with you everywhere try it now 😎.
          </p>
          <Link to="/all-diaries">Start Now</Link>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Home;
