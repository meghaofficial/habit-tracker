import { Navigate, useParams } from "react-router-dom";
import WeeklyTarget from "./WeeklyTarget"
import { weekColors } from "../../staticData";

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
    <div 
    // style={{
    //   background: (week === 'week-1' && weekColors[0]) || (week === 'week-2' && weekColors[1]) || (week === 'week-3' && weekColors[2]) || (week === 'week-4' && weekColors[3]) || (week === 'week-5' && weekColors[4]) || '#FFFCF9'
    // }} 
    className="h-full">
      <p>{week}</p>
      <div className=' h-full min-h-screen p-6'>
        <WeeklyTarget />
      </div>
    </div>
  )
}

export default WeeklyLayout
