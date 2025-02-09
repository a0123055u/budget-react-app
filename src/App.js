// import logo from './logo.svg';
import './App.css';
import Login from './components/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
// import { Component } from 'react';

function App() {
  return (


   <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute />}>
        <Route index element={<Home />} />
        </Route>  
      </Routes>
    </Router>

  );
}

export default App;
