import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store/store";
import { updateTaskName } from "../../../redux/slices/monthlySlice";

const HabitSection = () => {

  const dispatch = useDispatch();
  const monthlyData = useSelector(
    (state: RootState) => state.monthlyData
  );
  // const { year, month } = useParams();
    const year = "2026";
  const month = "Apr";

  const handleChange = (id: string, value: string) => {
    if (!month || !year) return;
    dispatch(updateTaskName({ year, month, taskID: id, taskName: value }));
  }

  return (
    <>
      <div className="">
        <p className="smText p-5.5 text-center border-b border-black" style={{ fontWeight: "bolder" }}>DAILY HABITS</p>
        <p className="smText p-2.5 text-center border-b border-darkBg bg-darkPrimary light:bg-lightPrimary" style={{ fontWeight: "bold" }}>HABITS</p>
        {/* task input */}
        {month && year && monthlyData[year][month]?.taskwise?.map((task, index) => (
          <div className="text-[12px] px-2 p-1 flex items-center gap-2 border-b border-gray-700" key={index}>
            <span>{index + 1}</span>
            <input type="text" className="outline-none w-full py-1" title="value" value={year && month ? task?.task : ""} onChange={(e) => handleChange(task?.taskID, e.target.value)} />
          </div>
        ))}
      </div>
    </>
  )
}

export default HabitSection