import MonthHeader from "./header/MonthHeader"
import MonthMainComponent from "./taskSheet/MonthMainComponent"

const TaskDashboardLayout = () => {
  return (
    <>
      <div className='bg-backg h-full min-h-screen p-6'>
        <MonthHeader />
        <MonthMainComponent />
      </div>
    </>
  )
}

export default TaskDashboardLayout
