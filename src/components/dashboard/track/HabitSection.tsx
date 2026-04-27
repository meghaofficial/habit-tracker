import type { ITask } from "../../../types";
import { axiosPrivate } from "../../../api/axios";
import { debounce, notify } from "../../../helper";
import { useMemo } from "react";

const HabitSection = ({ data }: { data: ITask[] }) => {

  const handleChange = async (id: string, value: string) => {
    // setFreeTrialLoading(true);
    try {

      await axiosPrivate.put(`/api/update-task-name?taskId=${id}`, { taskName: value });

    } catch (error) {
      console.error(error);
      notify.error("Please try again.");
    } finally {
      // setFreeTrialLoading(false);
    }
  }

  const debouncedHandleChange = useMemo(
    () => debounce(handleChange, 1000),
    []
  );

  return (
    <>
      <div className="">
        <p className="smText p-5.5 text-center border-b border-black" style={{ fontWeight: "bolder" }}>DAILY HABITS</p>
        <p className="smText p-2.5 text-center border-b border-darkBg bg-darkPrimary light:bg-lightPrimary" style={{ fontWeight: "bold" }}>HABITS</p>
        {/* task input */}
        {data?.map((task, index) => (
          <div className="text-[12px] px-2 p-1 flex items-center gap-2 border-b border-gray-700" key={index}>
            <span>{index + 1}</span>
            <input type="text" className="outline-none w-full py-1" title="value" value={task?.name} onChange={(e) => debouncedHandleChange(task?._id, e.target.value)} />
          </div>
        ))}
      </div>
    </>
  )
}

export default HabitSection