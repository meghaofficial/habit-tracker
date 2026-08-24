import { motion } from "framer-motion";
import { FilledPieChart } from "../../charts/FilledPieChart";
import { FiAward, FiCalendar } from "react-icons/fi";
import CardHeader from "../../shared/CardHeader";
import { useQuery } from "@tanstack/react-query";
import { getTargets } from "../../../api/dashboard.api";

const Targets = ({ monthDashID }: { monthDashID: string }) => {
  const monthlyTargetsData = useQuery({
    queryKey: ["targets", "monthly", monthDashID, 0],
    queryFn: () =>
      getTargets({
        type: "monthly",
        monthID: monthDashID,
      }),
    enabled: !!monthDashID,
  });
  const monthlyTargets = monthlyTargetsData?.data?.target?.targets ?? [];
  const monthlyTargetsDone =
    monthlyTargets?.filter((d: any) => d?.completed).length || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* Monthly Targets */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20"
      >
        <div className="absolute bottom-0 right-0 w-44 h-28 sm:w-56 sm:h-36 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-36 h-36 sm:w-44 sm:h-44 bg-indigo-500/5 rounded-full blur-3xl" />

        <div>
          <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
            <CardHeader
              icon={FiAward}
              title="Monthly Targets"
              subTitle="This Month"
            />
          </div>

          <div className="relative p-4 flex items-center justify-center">
            <div className="w-full max-w-xs mx-auto">
              {monthlyTargets.length > 0 ? (
                <FilledPieChart
                  done={monthlyTargetsDone}
                  left={monthlyTargets.length - monthlyTargetsDone}
                  height={260}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-75">
                  <p className="text-gray-500 text-[12px]">No Data Found!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Targets */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20"
      >
        <div className="absolute bottom-0 left-0 w-48 h-28 sm:w-64 sm:h-32 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-36 h-36 sm:w-48 sm:h-48 bg-indigo-500/5 rounded-full blur-3xl" />

        <div>
          <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                <FiCalendar size={14} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Weekly Targets</p>
                <p className="text-[10px] text-gray-500">Five week breakdown</p>
              </div>
            </div>
          </div>

          <div className="relative p-4 grid grid-cols-2 min-[520px]:grid-cols-3 xl:grid-cols-5 gap-2.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <WeeklyTargets monthDashID={monthDashID} week={index + 1} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const WeeklyTargets = ({
  monthDashID,
  week,
}: {
  monthDashID: string;
  week: number;
}) => {
  const weekData = useQuery({
    queryKey: ["targets", "weekly", monthDashID, week],
    queryFn: () =>
      getTargets({
        type: "weekly",
        monthID: monthDashID,
        week,
      }),
    enabled: !!monthDashID,
  });
  const weekTargets = weekData?.data?.target?.targets ?? [];
  const weekTargetsDone =
    weekTargets?.filter((d: any) => d?.completed).length || 0;

  return (
    <div
      key={week}
      className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/8 p-2.5"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[8px] text-gray-300 uppercase tracking-widest font-bold">
          Week {week}
        </p>
      </div>
      {weekTargets.length > 0 ? (
        <FilledPieChart
          done={weekTargetsDone}
          left={weekTargets?.length - weekTargetsDone}
          height={112}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-28">
          <p className="text-gray-500 text-[12px]">No Data Found!</p>
        </div>
      )}
    </div>
  );
};

export default Targets;
