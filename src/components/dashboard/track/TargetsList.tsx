import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RxCross2 } from "react-icons/rx";
import { PiNotepad } from "react-icons/pi";

interface Target {
  id: string;
  text: string;
  completed: boolean;
}

const TargetsList = () => {

  const [targets, setTargets] = useState<Target[]>([]);
  const [singleTarget, setSingleTarget] = useState("");

  const toggleTarget = (id: string) => {
    setTargets((prev) =>
      prev.map((target) =>
        target.id === id
          ? { ...target, completed: !target.completed }
          : target
      )
    );
  };

  const handleAddSingleTarget = () => {
    if (!singleTarget.trim()) return;
    setTargets(prev => ([
      ...prev,
      {
        id: uuidv4(), text: singleTarget, completed: false
      }
    ]));
    setSingleTarget("");
  }

  const handleRemoveTarget = (id: string) => {
    const updated = targets.filter(t => t?.id !== id);
    setTargets(updated);
  }

  return (
    <>
      {/* input */}
      <div className="flex gap-4 px-4 mt-2">
        <input type="text" className="focus:outline-none focus:ring-2 focus:ring-darkPrimary light:focus:ring-lightPrimary resize-none rounded-lg px-3 py-2 text-[14px] w-[80%] border border-gray-500" onChange={(e) => setSingleTarget(e.target.value)} value={singleTarget} />
        <button className="text-[14px] border-none rounded-md text-white cursor-pointer bg-darkPrimary light:bg-lightPrimary w-[20%]" onClick={handleAddSingleTarget}>
          Add
        </button>
      </div>
      {/* Targets List */}
      <div className="w-full px-2 max-h-70 overflow-y-auto mt-3">
        {targets.length > 0 ? targets.map((target, index) => (
          <div
            key={target?.id}
            className="bg-darkCard light:bg-lightCard px-4 py-3 rounded-lg transition flex items-center w-full gap-2"
          >
            <span>{index + 1}.</span>
            <div className="flex items-center justify-between w-full">
              {/* Target Text */}
              <span
                className={`text-sm transition ${target?.completed
                  ? "line-through text-slate-400"
                  : ""
                  }`}
              >
                {target?.text}
              </span>

              <div className="flex items-center gap-2">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={target?.completed}
                  onChange={() => toggleTarget(target?.id)}
                  className="w-4 h-4 accent-darkPrimary cursor-pointer"
                />
                <RxCross2 className="text-gray-500 cursor-pointer hover:text-red-500" onClick={() => handleRemoveTarget(target?.id)} />
              </div>
            </div>
          </div>
        )) : (
          <div className="flex items-center justify-center flex-col text-gray-700 google-sans h-60 gap-3">
            <PiNotepad className="text-[80px]" />
            <span className="text-[14px]">Add Monthly Targets</span>
          </div>
        )}
      </div>
    </>
  )
}

export default TargetsList
