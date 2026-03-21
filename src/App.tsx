import './App.css'
import MonthHeader from './components/MonthHeader'
import MonthMainComponent from './components/MonthMainComponent'

function App() {

  return (
    <>
      <div className='bg-backg h-full min-h-screen p-6'>
        <MonthHeader />
        <MonthMainComponent />
      </div>
    </>
  )
}

export default App
