// App.js
import React from 'react';
import './App.css';
import Crud from './components/Crud'; 
import Login from './components/Login';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from './components/Register';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crud" element={<Crud />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
