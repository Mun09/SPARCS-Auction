import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Goods from './pages/goods';
import HomePage from './pages/home';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <HomePage/> }/>
          <Route path='/goods' element={ <Goods/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
