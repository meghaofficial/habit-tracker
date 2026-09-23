import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiCheck, FiPlus, FiTarget, FiX } from "react-icons/fi";
import type { TargetI } from "../../../types";
import {
  addTarget,
  getTargets,
  markTarget,
  removeTarget,
} from "../../../api/dashboard.api";
import SectionIcon from "../../shared/SectionIcon";
import { axiosPrivate } from "../../../api/axios";
import { TargetProgressTab } from "./TargetProgressTab";
import { socket } from "../../../socket/socket";

type SummaryType = {
  total: number;
  completed: number;
  remaining: number;
};

const TargetsSection = ({
  monthID,
  totalWeeks,
  totalDaysInMonth,
}: {
  monthID: string;
  totalWeeks: number;
  totalDaysInMonth: number;
}) => {
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const dateRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeDate, setActiveDate] = useState(new Date().getDate());
  const [summary, setSummary] = useState<{
    monthlySummary: SummaryType;
    weeklySummary: (SummaryType & { week: number })[];
    dailySummary: (SummaryType & { dateNo: number })[];
  }>({
    monthlySummary: {
      total: 0,
      completed: 0,
      remaining: 0,
    },
    weeklySummary: [],
    dailySummary: [],
  });

  const tabs = [
    { key: 0, label: "Monthly" },
    ...Array.from({ length: totalWeeks }, (_, i) => ({
      key: i + 1,
      label: `Week ${i + 1}`,
    })),
    { key: -1, label: "Daily" },
  ];

  useLayoutEffect(() => {
    const container = dateContainerRef.current;
    const selectedDate = dateRefs.current[activeDate];

    if (!container || !selectedDate) return;

    const containerRect = container.getBoundingClientRect();
    const selectedRect = selectedDate.getBoundingClientRect();

    const scrollPosition =
      container.scrollLeft + (selectedRect.left - containerRect.left) - 16;

    container.scrollTo({
      left: scrollPosition,
      behavior: "auto",
    });
  }, [activeTab]);

  const getSummary = async () => {
    try {
      const res = await axiosPrivate.get(
        `/api/targets-summary?monthDashID=${monthID}`,
      );
      if (res?.data?.success) {
        const { monthlySummary, weeklySummary, dailySummary } = res?.data;
        setSummary({ monthlySummary, weeklySummary, dailySummary });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <div className="relative overflow-hidden h-125 rounded-2xl w-full border border-white/10 bg-black/20">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/3 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <SectionIcon Icon={FiTarget} />
          <div>
            <p className="text-sm font-bold text-white">Targets</p>
            <p className="text-[10px] text-gray-500">
              Monthly &amp; weekly goals
            </p>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => {
          const isMonthly = tab.key === 0;

          const summ = isMonthly
            ? summary.monthlySummary
            : summary.weeklySummary.find((item) => item.week === tab.key);

          return (
            <TargetProgressTab
              key={tab.key}
              label={tab.label}
              total={summ?.total ?? 0}
              completed={summ?.completed ?? 0}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              variant="week"
            />
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative">
        {activeTab === -1 && (
          <div
            ref={dateContainerRef}
            className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 overflow-x-auto hide-scrollbar"
          >
            {Array.from({ length: totalDaysInMonth }).map((_, index) => {
              const date = index + 1;

              const summ = summary.dailySummary.find(
                (item) => item.dateNo === date,
              );

              return (
                <TargetProgressTab
                  key={date}
                  label={String(date)}
                  total={summ?.total ?? 0}
                  completed={summ?.completed ?? 0}
                  active={activeDate === date}
                  onClick={() => setActiveDate(date)}
                  buttonRef={(el) => {
                    dateRefs.current[date] = el;
                  }}
                />
              );
            })}
          </div>
        )}
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <InlineTargetsList
                monthID={monthID}
                type={
                  activeTab === -1
                    ? "daily"
                    : activeTab === 0
                      ? "monthly"
                      : "weekly"
                }
                week={activeTab === 0 ? 0 : activeTab}
                dateNo={activeDate}
                getSummary={getSummary}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const InlineTargetsList = ({
  monthID,
  type,
  week,
  dateNo,
  getSummary,
}: {
  monthID: string;
  type: string;
  week: number;
  dateNo: number;
  getSummary: () => Promise<void>;
}) => {
  const [input, setInput] = useState("");
  const [targets, setTargets] = useState<TargetI[]>([]);

  const [loadingVals, setLoadingVals] = useState({
    getTargetsLoading: false,
    addTargetLoading: false,
    markTargetLoading: "",
    removeTargetLoading: "",
  });

  const loadingValsSetup = (
    key: keyof typeof loadingVals,
    value: boolean | string,
  ) => {
    setLoadingVals((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGetTargets = async () => {
    loadingValsSetup("getTargetsLoading", true);

    try {
      const res = await getTargets({
        type,
        monthID,
        week,
        dateNo,
      });

      setTargets(res?.target?.targets ?? []);
    } catch (error) {
      console.error("Error getting targets:", error);
      setTargets([]);
    } finally {
      loadingValsSetup("getTargetsLoading", false);
    }
  };

  useEffect(() => {
    handleGetTargets();
  }, [type, monthID, week, dateNo]);

  const completedCount = targets.filter((target) => target.completed).length;

  const progress =
    targets.length > 0
      ? Math.round((completedCount / targets.length) * 100)
      : 0;

  const handleAddTarget = async () => {
    const value = input.trim();

    if (!value || targets.length >= 10) return;

    loadingValsSetup("addTargetLoading", true);

    try {
      const res = await addTarget({
        type,
        monthID,
        week,
        target: value,
        dateNo,
        socketID: socket?.id || "",
      });

      setTargets(res?.target?.targets ?? []);
      await getSummary();

      setInput("");
    } catch (error) {
      console.error("Error adding target:", error);
    } finally {
      loadingValsSetup("addTargetLoading", false);
    }
  };

  // =========================
  // MARK TARGET
  // =========================

  const handleMarkTarget = async (targetID: string, completed: boolean) => {
    loadingValsSetup("markTargetLoading", targetID);

    try {
      const res = await markTarget({
        type,
        monthID,
        week,
        targetID,
        mark: completed,
        dateNo,
        socketID: socket?.id || "",
      });

      /*
       * If API returns the complete updated target list,
       * use it directly.
       */
      if (res?.target?.targets) {
        setTargets(res.target.targets);
      } else {
        /*
         * Otherwise update only the target locally.
         */
        setTargets((prev) =>
          prev.map((target) =>
            target._id === targetID
              ? {
                  ...target,
                  completed,
                }
              : target,
          ),
        );
      }
      await getSummary();
    } catch (error) {
      console.error("Error marking target:", error);
    } finally {
      loadingValsSetup("markTargetLoading", "");
    }
  };

  // =========================
  // REMOVE TARGET
  // =========================

  const handleRemoveTarget = async (targetID: string) => {
    loadingValsSetup("removeTargetLoading", targetID);

    try {
      await removeTarget({
        type,
        monthID,
        week,
        targetID,
        dateNo,
        socketID: socket?.id || "",
      });
      setTargets((prev) => prev.filter((target) => target._id !== targetID));
      await getSummary();
    } catch (error) {
      console.error("Error removing target:", error);
    } finally {
      loadingValsSetup("removeTargetLoading", "");
    }
  };

  useEffect(() => {
    const handleTargetAdded = (data: any) => {
      setTargets(data?.targets ?? []);
    };

    const handleTargetRemoved = (data: any) => {
      setTargets(data?.targets ?? []);
    };

    const handleTargetMark = (data: any) => {
      setTargets(data?.targets ?? []);
    };

    socket.on(`add-${type}-target`, handleTargetAdded);
    socket.on(`remove-${type}-target`, handleTargetRemoved);
    socket.on(`mark-${type}-target`, handleTargetMark);

    return () => {
      socket.off(`add-${type}-target`, handleTargetAdded);
      socket.off(`remove-${type}-target`, handleTargetRemoved);
      socket.off(`mark-${type}-target`, handleTargetMark);
    };
  }, [type]);

  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      {targets.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            />
          </div>

          <span className="shrink-0 text-[10px] font-bold text-indigo-400">
            {completedCount}/{targets.length} done
          </span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loadingVals.addTargetLoading) {
              handleAddTarget();
            }
          }}
          disabled={targets.length >= 10 || loadingVals.addTargetLoading}
          placeholder={
            targets.length >= 10
              ? "Max 10 targets reached"
              : type === "monthly"
                ? "Add a monthly target…"
                : type === "weekly"
                  ? "Add a weekly target…"
                  : "Add a daily target…"
          }
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:border-indigo-500/40 focus:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          onClick={handleAddTarget}
          disabled={
            loadingVals.addTargetLoading ||
            !input.trim() ||
            targets.length >= 10
          }
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/20 px-3 py-2 text-[11px] font-semibold text-indigo-300 transition-colors duration-200 hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loadingVals.addTargetLoading ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-indigo-300 border-t-transparent" />
          ) : (
            <FiPlus size={13} />
          )}
          Add
        </button>
      </div>

      {/* Target list */}
      <div className="hide-scrollbar flex max-h-70 flex-col gap-2 overflow-y-auto">
        {loadingVals.getTargetsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-xl bg-white/5" />
          ))
        ) : targets.length === 0 ? (
          <div className="flex h-70 flex-col items-center justify-center gap-2 py-6">
            <FiTarget size={24} className="text-gray-600" />

            <p className="text-[11px] text-gray-500">
              No targets yet. Add one above.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {targets.map((target) => (
              <motion.div
                key={target._id}
                initial={{
                  opacity: 0,
                  y: -6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  marginBottom: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                className={`group flex items-center gap-2.5 rounded-xl border p-2.5 transition-all duration-200 ${
                  target.completed
                    ? "border-emerald-500/20 bg-emerald-500/8"
                    : "border-white/8 bg-white/2 hover:border-white/15"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() =>
                    handleMarkTarget(target._id, !target.completed)
                  }
                  disabled={loadingVals.markTargetLoading === target._id}
                  className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-all duration-200 disabled:cursor-not-allowed ${
                    target.completed
                      ? "border-emerald-500/50 bg-emerald-500/30 text-emerald-400"
                      : "border-white/15 bg-white/5 hover:border-indigo-500/40"
                  }`}
                >
                  {loadingVals.markTargetLoading === target._id ? (
                    <span className="h-2.5 w-2.5 animate-spin rounded-full border border-emerald-400 border-t-transparent" />
                  ) : target.completed ? (
                    <FiCheck size={10} />
                  ) : null}
                </button>

                {/* Text */}
                <p
                  className={`flex-1 text-[12px] leading-tight ${
                    target.completed
                      ? "text-gray-500 line-through"
                      : "text-white/80"
                  }`}
                >
                  {target.value}
                </p>

                {/* Remove */}
                <button
                  onClick={() => handleRemoveTarget(target._id)}
                  disabled={loadingVals.removeTargetLoading === target._id}
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 text-rose-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 disabled:cursor-not-allowed"
                >
                  {loadingVals.removeTargetLoading === target._id ? (
                    <span className="h-2 w-2 animate-spin rounded-full border border-rose-400 border-t-transparent" />
                  ) : (
                    <FiX size={9} />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TargetsSection;
