import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './PageNotFound.module.css';
const PageNotFound = () => {
  useEffect(() => {
    document.title = ' Page not found :(';
  }, []);
  return (
    <div className={classes.mainContainer}>
      <h2>Page not found 😞!</h2>
      <Link to="/">Home</Link>
    </div>
  );
};

export default PageNotFound;
