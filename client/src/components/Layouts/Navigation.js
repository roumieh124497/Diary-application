import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Navigation.module.css';
const Navigation = props => {
  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul className={classes.navLists}>
          <li className={classes.navList}>
            <img
              src="/logodiary.png"
              alt="diary"
              className={classes.logoImage}
            />
          </li>
          <li className={classes.appName}>Diary App</li>
          <li className={classes.navList}>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
