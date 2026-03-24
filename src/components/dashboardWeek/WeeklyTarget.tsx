import { useState } from "react";
import type { TargetType } from "../../types";
import CustomCheckbox from "../dashboard/taskSheet/CustomCheckbox";
import { MdOutlineDelete } from "react-icons/md";

const WeeklyTarget = () => {

  const [totalTargets, setTotalTargets] = useState<TargetType[]>([{
      goal: "", isDone: false
    }]);
    const rowLimit = 10;
  
    const toggleCheckbox = (index: number, checked: boolean) => {
      setTotalTargets(prev =>
        prev.map((item, i) =>
          i === index ? { ...item, isDone: checked } : item
        )
      );
    };
  
    const handleRemove = (index: number) => {
      if (totalTargets.length <= 1) return;
      setTotalTargets((prev) => prev.filter((_, i) => i !== index));
    }
  
    const handleChange = (value: string, index: number) => {
      setTotalTargets(prev =>
        prev.map((item, i) =>
          i === index ? { ...item, goal: value } : item
        )
      );
    }

  return (
    <>
      <div className="border">
        <p className="text-center bg-smHeaderBg border-b border-subHeaderText flex items-center text-[8px] font-semibold">
          <span className="py-[9.5px] tracking-widest w-1/2 text-center">THIS WEEK'S GOALS</span>
          <span className="py-[9.5px] tracking-widest w-1/2 text-center">NOTE</span>
        </p>
        {/* targets */}
        <div className="p-2 flex gap-2 items-start">
          <div className="h-50 w-1/2 overflow-y-auto">
            {Object.values(totalTargets).map((t, index) => (
              <div key={index} className="flex items-center gap-2">
                <CustomCheckbox
                  key={index}
                  checked={t.isDone}
                  onChange={(checked) => t.goal && toggleCheckbox(index, checked)}
                  color="headerBg"
                  size={10}
                />
                <input type="text" className={`outline-none w-full text-[10px] p-1 border-b-[0.1px] ${t.isDone && 'line-through'}`} title="value" value={t.goal} onChange={(e) => handleChange(e.target.value, index)} />
                <MdOutlineDelete className="cursor-pointer" onClick={() => handleRemove(index)} />
              </div>
            ))}
            {Object.values(totalTargets).length < rowLimit && (
              <button
                className="border border-black/50 cursor-pointer mt-3 text-[10px] p-0.5 px-1.5"
                onClick={() => {
                  setTotalTargets(prev => ([...prev, { goal: "", isDone: false }]))
                }}
              >
                Add Goal +
              </button>
            )}
          </div>
          <textarea className="resize-none border-[0.1px] w-1/2 outline-none text-[10px] p-2 h-50 google-sans"></textarea>
        </div>
      </div>
    </>
  )
}

export default WeeklyTarget
