import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Menu from './Menu';
import Task from './Task';
import Chat from './Chat';
import Store from './Store';
import SignUp from './SignUp';

// Create a root
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path='/menu' element={<Menu/>}/>
      <Route path="/menu/tasks" element={<Task/>}/>
      <Route path='/menu/chat' element={<Chat/>}/>
      <Route path='/menu/store' element={<Store/>}/>
      <Route path="/signup" element={<SignUp/>}/>
    </Routes>
  </Router>
);
