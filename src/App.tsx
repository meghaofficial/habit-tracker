import { Route, Routes } from 'react-router-dom'
import './App.css'
import YearCalander from './components/calander/YearCalander'
import TaskDashboardLayout from './components/dashboard/TaskDashboardLayout'
import PageNotFound from './components/shared/PageNotFound'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setYear } from './redux/slices/monthlySlice'
import type { RootState } from './redux/store/store'

function App() {

  const dispatch = useDispatch();

  const [currYear, setCurrYear] = useState(0);
  const monthlyData = useSelector(
    (state: RootState) => state.monthlyData
  );

  useEffect(() => {
    const date = new Date();
    const y = date.getFullYear();
    setCurrYear(y);
  }, []);

  // useEffect(() => {
  //   if (currYear === 0) return;
  //   dispatch(setYear({ year: currYear.toString() }));
  // }, [currYear]);

  const date = new Date();
  dispatch(setYear({ year: date.getFullYear().toString() }));

  return (
    <>
      <Routes>
        <Route path='/' element={<YearCalander />} />
        <Route path='/:year/:month' element={<TaskDashboardLayout />} />
        <Route path='/*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
