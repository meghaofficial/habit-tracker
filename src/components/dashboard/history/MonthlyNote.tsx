import { useEffect, useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import Card from "../../shared/Card";
import { FiAward, FiFileText } from "react-icons/fi";
import { formatTimestamp } from "../../../helper";

const MonthlyNote = ({ monthDashID }: { monthDashID: string }) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");

  const getNote = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/monthly-note?monthDashID=${monthDashID}`,
      );

      if (res?.data?.success) {
        if (res?.data?.note) {
          setNote(res?.data?.note?.note);
          setLastUpdate(res?.data?.note?.updatedAt);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (monthDashID) {
      getNote();
    }
  }, [monthDashID]);

  return (
    <Card heading="" cardWidth="w-full">
      <div className="p-1 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <FiFileText className="text-orange-400" /> Reflections & Notes
        </h3>
        {loading ? (
          <div className="h-50 overflow-y-hidden flex justify-center animate-pulse bg-white/5 rounded-2xl"></div>
        ) : (
          <>
            {note ? (
              <div className="bg-white/2 border border-white/5 rounded-2xl p-4 h-50 flex flex-col justify-between">
                <div className="overflow-y-auto h-40">
                  <p className="text-sm text-gray-300 leading-relaxed italic">
                    {note}
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-500 mt-4 border-t border-white/5 pt-3">
                  <span className="font-semibold flex items-center gap-1">
                    <FiAward className="text-yellow-500" />
                    Last updated at
                  </span>
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {lastUpdate
                      ? formatTimestamp(lastUpdate)
                      : "Info Unavailable"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-50 items-center flex justify-center">
                <span className="text-[12px] text-gray-500">Not found!</span>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default MonthlyNote;
