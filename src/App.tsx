import { Route, Routes } from 'react-router-dom'
import './App.css'
import YearCalander from './components/calander/YearCalander'
import TaskDashboardLayout from './components/dashboard/TaskDashboardLayout'
import PageNotFound from './components/shared/PageNotFound'

function App() {

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
