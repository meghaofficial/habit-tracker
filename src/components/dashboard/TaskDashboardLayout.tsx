import { Navigate, useParams } from "react-router-dom";
import MonthHeader from "./header/MonthHeader"
import MonthMainComponent from "./taskSheet/MonthMainComponent"
import { months } from "../../staticData";
import AnalysisLayout from "./analysis/AnalysisLayout";

const TaskDashboardLayout = () => {

  const { year, month } = useParams<{ year: string; month: string }>();

  if (!year || isNaN(+year) || +year < new Date().getFullYear() || !month || !Object.keys(months).includes(month)) {
    return <Navigate to="/404" />;
  }

  return (
    <>
      <div className='bg-backg h-full min-h-screen p-6'>
        <MonthHeader />
        <MonthMainComponent />
        <AnalysisLayout />
      </div>
    </>
  )
}

export default TaskDashboardLayout
