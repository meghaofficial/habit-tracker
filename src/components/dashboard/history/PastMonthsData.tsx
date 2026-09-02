import { type Dispatch, type SetStateAction } from "react";
import type { DashboardI } from "../../../types";
import { FiArchive, FiCalendar } from "react-icons/fi";
import { monMap } from "../../../staticData";
import Card from "../../shared/Card";

const PastMonthsData = ({
  selectedMonthId,
  setSelectedMonthId,
  data
}: {
  selectedMonthId: string;
  setSelectedMonthId: Dispatch<SetStateAction<string>>;
  data: DashboardI[];
}) => {

  return (
    <Card heading="" cardWidth="w-full">
      <div className="p-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20 text-yellow-400">
            <FiArchive size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
              History Archive
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Select a past month
            </p>
          </div>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto hide-scrollbar">
          {data.map((d) => {
            const isActive = d._id === selectedMonthId;
            return (
              <button
                key={d._id}
                onClick={() => setSelectedMonthId(d._id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 border ${
                  isActive
                    ? "bg-linear-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/50 shadow-md"
                    : "bg-white/2 border-white/5 hover:bg-white/2 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiCalendar
                    className={isActive ? "text-yellow-400" : "text-gray-500"}
                  />
                  <div className="text-left">
                    <p
                      className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-300"}`}
                    >
                      {monMap[d.month+1]} {d.year}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {d.totalTasks} Habits Tracked
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    isActive
                      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      : "bg-white/5 text-gray-400 border-white/5"
                  }`}
                >
                  {d.progress}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default PastMonthsData;
