import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Main from './components/Main';
import Setting from './components/Setting';
import { ToastContainer } from 'react-toastify';
import NewDiary from './components/NewDiary';

import { io } from 'socket.io-client';
import InboxDiary from './components/InboxDiary';
import { toast } from 'react-toastify';
import PageNotFound from './components/PageNotFound';
import ProtectedRouter from './components/ProtectedRouter';
function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io.connect('https://obscure-dusk-03088.herokuapp.com/'));
  }, []);

  useEffect(() => {
    socket?.on('notification', data => {
      toast(`You have a new notification from ${data.senderEmail}`);
    });
  }, [socket]);

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/setting"
          element={
            <ProtectedRouter>
              <Setting socket={socket} />
            </ProtectedRouter>
          }
        />
        <Route
          path="/all-diaries"
          element={
            <ProtectedRouter>
              <Main socket={socket} />
            </ProtectedRouter>
          }
        />
        <Route
          path="/new-diary"
          element={
            <ProtectedRouter>
              <NewDiary socket={socket} />
            </ProtectedRouter>
          }
        />
        <Route
          path="/inbox-diary"
          element={
            <ProtectedRouter>
              <InboxDiary socket={socket} />
            </ProtectedRouter>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
