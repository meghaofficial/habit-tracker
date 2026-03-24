import { Route, Routes } from 'react-router-dom'
import './App.css'
import YearCalander from './components/calander/YearCalander'
import TaskDashboardLayout from './components/dashboard/TaskDashboardLayout'
import PageNotFound from './components/shared/PageNotFound'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setYear } from './redux/slices/monthlySlice'
import type { RootState } from './redux/store/store'
import WeeklyLayout from './components/dashboardWeek/WeeklyLayout'

function App() {

  const dispatch = useDispatch();

  const date = new Date();
  dispatch(setYear({ year: date.getFullYear().toString() }));

  return (
    <>
      <Routes>
        <Route path='/' element={<YearCalander />} />
        <Route path='/:year/:month' element={<TaskDashboardLayout />} />
        <Route path='/:week' element={<WeeklyLayout />} />
        <Route path='/*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
