import { Route, Routes } from 'react-router-dom'
import './App.css'
import PageNotFound from './components/shared/PageNotFound'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { setYear } from './redux/slices/monthlySlice'
import type { RootState } from './redux/store/store'
import Demo from './components/pages/Demo'
import Dashboard from './components/pages/Dashboard'
import HomePage from './components/pages/HomePage'
import { refreshAccessToken } from './api/axios'
import { setCreds } from './redux/slices/authSlice'
import PageLoader from './components/loaders/PageLoader'
import { ToastContainer } from 'react-toastify'

function App() {

  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.auth.username !== "");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await refreshAccessToken();

        if (data?.success) {
          const { username, email, id } = data?.user;
          dispatch(setCreds({ username, email, id }));
        }

      } catch (err) {
        console.log("User not logged in");
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    isAuthLoading ? 
    <div className='flex items-center justify-center h-screen'>
      <PageLoader />
    </div> :
    <div className='bg-darkBg light:bg-lightBg text-darkText light:text-lightText'>
      <ToastContainer position="top-right" autoClose={3000} />
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
