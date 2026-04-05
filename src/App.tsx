import { Route, Routes } from 'react-router-dom'
import './App.css'
import YearCalander from './components/calander/YearCalander'
import PageNotFound from './components/shared/PageNotFound'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setYear } from './redux/slices/monthlySlice'
import type { RootState } from './redux/store/store'
import WeeklyLayout from './components/dashboardWeek/WeeklyLayout'
import Demo from './components/pages/Demo'
import Dashboard from './components/pages/Dashboard'
import HomePage from './components/pages/HomePage'

function App() {

  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.auth.username !== "");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const root = window.document.documentElement;
    if (savedTheme === "dark") {
      root.classList.remove("light");
    }
    else {
      root.classList.add("light");
    }
  }, []);

  const date = new Date();
  dispatch(setYear({ year: date.getFullYear().toString() }));

  return (
    <div className='bg-darkBg light:bg-lightBg text-darkText light:text-lightText'>
      <Routes>
        <Route path='/' element={isLogin ? <Dashboard /> : <HomePage />} />
        <Route path='/demo' element={<Demo />} />
        {/* <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/plan' element={<Dashboard />} /> */}
        {/* <Route path='/' element={<YearCalander />} />
        <Route path='/:week' element={<WeeklyLayout />} /> */}
        <Route path='/*' element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default App
