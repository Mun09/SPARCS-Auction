import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import PageNotFound from './pages/404';
import Goods from './pages/goods';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import MyPage from './pages/mypage';
import RegisterPage from './pages/register';
import Upload from './pages/upload';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <HomePage/> }/>
          <Route path='/goods' element={ <Goods/> }/>
          <Route path='/upload' element={ <Upload/>} />
          <Route path='/mypage' element={ <MyPage/>} />
          <Route path='/login' element={ <LoginPage/>} />
          <Route path='/register' element={ <RegisterPage/>} />
          <Route path='*' element={ <PageNotFound/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
