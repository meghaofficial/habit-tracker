import { Navigate, useParams } from "react-router-dom";
import WeeklyTarget from "./WeeklyTarget"

const WeeklyLayout = () => {

  const { week } = useParams();

   if (
    !week ||
    week !== 'week-1' &&
    week !== 'week-2' &&
    week !== 'week-3' &&
    week !== 'week-4' &&
    week !== 'week-5'
   ) {
      return <Navigate to="/404" />;
    }

  return (
    <>
      <div className='bg-backg h-full min-h-screen p-6'>
        <WeeklyTarget />
      </div>
    </>
  )
}

export default WeeklyLayout
