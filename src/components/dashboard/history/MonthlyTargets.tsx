import { useEffect, useState } from "react";
import Card from "../../shared/Card";
import { FiTarget } from "react-icons/fi";
import { axiosPrivate } from "../../../api/axios";
import type { TargetI } from "../../../types";

const MonthlyTargets = ({ monthDashID }: { monthDashID: string }) => {
  const [loading, setLoading] = useState(false);
  const [monthlyTargets, setMonthlyTargets] = useState<TargetI[]>([]);

  const getMonthlyData = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/monthly-targets?monthDashID=${monthDashID}`,
      );

      if (res?.data?.success) {
        if (res?.data?.target) {
          const targets = res?.data?.target?.targets;
          setMonthlyTargets(targets);
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
      getMonthlyData();
    }
  }, [monthDashID]);

  return (
    <Card heading="" cardWidth="w-full">
      <div className="p-1 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <FiTarget className="text-yellow-400" /> Monthly Targets Set
        </h3>
        {loading ? (
          <div className="h-50 overflow-y-hidden flex justify-center flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white/5 h-10 w-full rounded-lg"
              ></div>
            ))}
          </div>
        ) : (
          <>
            {monthlyTargets.length > 0 ? (
              <ul className="space-y-3.5 mt-1 h-50 overflow-y-auto">
                {monthlyTargets.map((t, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-3 border ${t.completed ? "border-green-600/50 bg-green-600/5 hover:bg-green-600/10" : "border-white/5 bg-white/1 hover:bg-white/3"}  p-3 rounded-xl transition-colors`}
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-300 leading-tight">
                      {t.value}
                    </span>
                  </li>
                ))}
              </ul>
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

export default MonthlyTargets;
