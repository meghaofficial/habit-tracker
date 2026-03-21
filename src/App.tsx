import { Route, Routes } from 'react-router-dom'
import './App.css'
import YearCalander from './components/calander/YearCalander'
import TaskDashboardLayout from './components/dashboard/TaskDashboardLayout'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<YearCalander />} />
        <Route path='/:month' element={<TaskDashboardLayout />} />
      </Routes>
    </>
  )
}

export default App
