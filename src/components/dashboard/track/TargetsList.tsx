import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RxCross2 } from "react-icons/rx";
import { PiNotepad } from "react-icons/pi";
import { axiosPrivate } from "../../../api/axios";

interface Target {
  _id: string;
  value: string;
  completed: boolean;
}

const TargetsList = ({ type, monthID }: { type: string, monthID: string }) => {

  const [targets, setTargets] = useState<Target[]>([]);
  const [singleTarget, setSingleTarget] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleTarget = (id: string) => {
    setTargets((prev) =>
      prev.map((target) =>
        target._id === id
          ? { ...target, completed: !target.completed }
          : target
      )
    );
  };

  // const handleAddSingleTarget = () => {
  //   if (!singleTarget.trim()) return;
  //   setTargets(prev => ([
  //     ...prev,
  //     {
  //       id: uuidv4(), text: singleTarget, completed: false
  //     }
  //   ]));
  //   setSingleTarget("");
  // }

  // const handleRemoveTarget = (id: string) => {
  //   const updated = targets.filter(t => t?.id !== id);
  //   setTargets(updated);
  // }

  const addTarget = async () => {
    if (!singleTarget.trim()) return;
    setLoading(true);
    try {
      const baseUrl = type === "monthly" ? `/api/add-monthly-target` : ``
      const res = await axiosPrivate.patch(`${baseUrl}?monthDashID=${monthID}`, { target: singleTarget });
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets);
        setSingleTarget("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const removeTarget = async (id: string) => {
    // setLoading(true);
    try {
      const url = type === "monthly" ? `/api/remove-monthly-target?monthDashID=${monthID}&targetID=${id}` : ``
      const res = await axiosPrivate.patch(url);
      if (res?.data?.success) {
        setTargets(prev => prev.filter(p => p?._id !== id))
        // setTargets(res?.data?.target?.targets);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  }

    const markTarget = async (id: string, mark: boolean) => {
    // setLoading(true);
    try {
      const url = type === "monthly" ? `/api/mark-monthly-target?monthDashID=${monthID}&targetID=${id}` : ``;
      const res = await axiosPrivate.patch(url, { mark });
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  }

  const getTargets = async () => {
    // setDashLoading(true);
    try {
      const baseUrl = type === "monthly" ? `/api/monthly-targets` : ``
      const res = await axiosPrivate.get(`${baseUrl}?monthDashID=${monthID}`);
      if (res?.data?.success) {
        setTargets(res?.data?.monthlyTargets?.targets);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  const monthlyTargetRef = useRef(false);

  useEffect(() => {
    if (monthlyTargetRef.current || !monthID) return;
    getTargets();
    monthlyTargetRef.current = true;
  }, [monthID]);

  return (
    <>
      {/* input */}
      <div className="flex gap-4 px-4 mt-2">
        <input disabled={targets?.length >= 10} type="text" className="focus:outline-none focus:ring-2 focus:ring-darkPrimary light:focus:ring-lightPrimary resize-none rounded-lg px-3 py-2 text-[14px] w-[80%] border border-gray-500" onChange={(e) => setSingleTarget(e.target.value)} value={singleTarget} />
        <button className={`text-[14px] border-none rounded-md ${targets?.length < 10 ? 'bg-darkPrimary light:bg-lightPrimary cursor-pointer text-white' : 'text-white/50 bg-darkPrimary/50 light:bg-lightPrimary/50'} w-[20%]`} onClick={addTarget} title={targets.length >= 10 ? 'Can not add more than 10 targets' : ""}>
          Add
        </button>
      </div>
      {/* Targets List */}
      <div className="w-full px-2 max-h-70 overflow-y-auto mt-3">
        {targets.length > 0 ? targets.reverse().map((target, index) => (
          <div
            key={target?._id}
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
                {target?.value}
              </span>

              <div className="flex items-center gap-2">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={target?.completed}
                  onChange={() => markTarget(target?._id, !target?.completed)}
                  className="w-4 h-4 accent-darkPrimary cursor-pointer"
                />
                <RxCross2 className="text-gray-500 cursor-pointer hover:text-red-500" onClick={() => removeTarget(target?._id)} />
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
