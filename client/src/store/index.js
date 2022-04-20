import { createStore } from 'redux';
import userReducer from './userReducer';
const store = createStore(userReducer);

export default store;
