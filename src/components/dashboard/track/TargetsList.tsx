import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { PiNotepad } from "react-icons/pi";
import { axiosPrivate } from "../../../api/axios";
import CircleLoader from "../../loaders/CircleLoader";

interface Target {
  _id: string;
  value: string;
  completed: boolean;
}

const TargetsList = ({ type, monthID, week = 0 }: { type: string, monthID: string, week?: number }) => {

  const [targets, setTargets] = useState<Target[]>([]);
  const [singleTarget, setSingleTarget] = useState("");
  const [loading, setLoading] = useState(false);

  const addTarget = async () => {
    if (!singleTarget.trim()) return;
    setLoading(true);
    try {
      const url = type === "monthly" ? `/api/add-monthly-target?monthDashID=${monthID}` : `/api/add-weekly-target?monthDashID=${monthID}&week=${week}`
      const res = await axiosPrivate.patch(url, { target: singleTarget });
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

  const [removeLoading, setRemoveLoading] = useState(false);
  const removeTarget = async (id: string) => {
    setRemoveLoading(true);
    try {
      const url = type === "monthly" ? `/api/remove-monthly-target?monthDashID=${monthID}&targetID=${id}` : `/api/remove-weekly-target?monthDashID=${monthID}&week=${week}&targetID=${id}`
      const res = await axiosPrivate.patch(url);
      if (res?.data?.success) {
        setTargets(prev => prev.filter(p => p?._id !== id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRemoveLoading(false);
    }
  }

  const markTarget = async (id: string, mark: boolean) => {
    try {
      const url = type === "monthly" ? `/api/mark-monthly-target?monthDashID=${monthID}&targetID=${id}` : `/api/mark-weekly-target?monthDashID=${monthID}&week=${week}&targetID=${id}`;
      const res = await axiosPrivate.patch(url, { mark });
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets || []);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const [getTargetsLoading, setGetTargetsLoading] = useState(false);
  const getTargets = async () => {
    setGetTargetsLoading(true);
    try {
      const url = type === "monthly" ? `/api/monthly-targets?monthDashID=${monthID}` : `/api/weekly-targets?monthDashID=${monthID}&week=${week}`
      const res = await axiosPrivate.get(url);
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGetTargetsLoading(false);
    }
  }

  // FIXED: Removed the buggy monthlyTargetRef condition entirely
  // Also added 'type' and 'week' dependencies so switching tabs updates the data
  useEffect(() => {
    if (!monthID) return;
    getTargets();
  }, [monthID, type, week]);

  return (
    <>
      {/* input */}
      <div className="flex gap-4 px-4 mt-2">
        <input 
          disabled={targets?.length >= 10} 
          type="text" 
          className="focus:outline-none focus:ring-2 focus:ring-darkPrimary light:focus:ring-lightPrimary resize-none rounded-lg px-3 py-2 text-[14px] w-[80%] border border-gray-500" 
          onChange={(e) => setSingleTarget(e.target.value)} 
          value={singleTarget} 
        />
        <button className={`text-[14px] border-none rounded-md 
          ${targets?.length < 10 ?
            'bg-darkPrimary light:bg-lightPrimary cursor-pointer text-white' :
            'text-white/50 bg-darkPrimary/50 light:bg-lightPrimary/50'} 
            w-[20%]`} onClick={() => {
            if (loading) return;
            addTarget();
          }} title={targets?.length >= 10 ? 'Can not add more than 10 targets' : ""}>
          {loading ? <CircleLoader /> : "Add"}
        </button>
      </div>
      {/* Targets List */}
      <div className="w-full px-2 max-h-70 overflow-y-auto mt-3">
        {getTargetsLoading ? (
          <div className="px-2 mt-1 flex items-center flex-col gap-2">
            <div className="bg-gray-500/50 rounded-lg h-10 w-full animate-pulse"></div>
            <div className="bg-gray-500/50 rounded-lg h-10 w-full animate-pulse"></div>
            <div className="bg-gray-500/50 rounded-lg h-10 w-full animate-pulse"></div>
            <div className="bg-gray-500/50 rounded-lg h-10 w-full animate-pulse"></div>
            <div className="bg-gray-500/50 rounded-lg h-10 w-full animate-pulse"></div>
          </div>
        ) : (
          <>
            {targets?.length > 0 ? (
              // FIXED: Creating a shallow copy before reversing to protect state mutations
              [...targets].reverse().map((target, index) => (
                <div
                  key={target?._id}
                  className="px-4 py-3 rounded-lg transition flex items-center w-full gap-2 mb-2"
                >
                  <span>{index + 1}.</span>
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-sm transition ${target?.completed
                        ? "line-through text-slate-400"
                        : ""
                        }`}
                    >
                      {target?.value}
                    </span>
                    {!removeLoading && (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={target?.completed}
                          onChange={() => markTarget(target?._id, !target?.completed)}
                          className="w-4 h-4 accent-darkPrimary cursor-pointer"
                        />
                        <RxCross2 className="text-gray-500 cursor-pointer hover:text-red-500" onClick={() => removeTarget(target?._id)} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center flex-col text-gray-700 google-sans h-60 gap-3">
                <PiNotepad className="text-[80px]" />
                <span className="text-[14px]">
                  {type === "monthly" ? "Add Monthly Targets" : "Add Weekly Targets"}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default TargetsList