import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './page/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;