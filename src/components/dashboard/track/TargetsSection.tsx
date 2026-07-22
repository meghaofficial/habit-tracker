import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCheck, FiPlus, FiTarget, FiX } from "react-icons/fi";
import { axiosPrivate as api } from "../../../api/axios";
import type { TargetI } from "../../../types";

const TargetsSection = ({
  monthID,
  totalWeeks,
}: {
  monthID: string;
  totalWeeks: number;
}) => {
    const [activeTab, setActiveTab] = useState<number>(0);
  
    const tabs = [
      { key: 0, label: "Monthly" },
      ...Array.from({ length: totalWeeks }, (_, i) => ({
        key: i + 1,
        label: `Week ${i + 1}`,
      })),
    ];
  
    return (
      <div className="relative overflow-hidden rounded-2xl w-full border border-white/10 bg-black/20">
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/3 via-transparent to-transparent pointer-events-none" />
  
        {/* Header */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center border border-violet-500/20 text-violet-400">
              <FiTarget size={14} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Targets</p>
              <p className="text-[10px] text-gray-500">
                Monthly &amp; weekly goals
              </p>
            </div>
          </div>
        </div>
  
        {/* Tab Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${activeTab === tab.key
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
  
        {/* Tab Content */}
        <div className="relative p-4">
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
                type={activeTab === 0 ? "monthly" : "weekly"}
                week={activeTab === 0 ? 0 : activeTab}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
}

const InlineTargetsList = ({
  monthID,
  type,
  week,
}: {
  monthID: string;
  type: string;
  week: number;
}) => {
  const [targets, setTargets] = useState<TargetI[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState("");
  const [markLoading, setMarkLoading] = useState("");

  const completedCount = targets.filter((t) => t.completed).length;
  const progress =
    targets.length > 0
      ? Math.round((completedCount / targets.length) * 100)
      : 0;

  const getTargets = async () => {
    setFetchLoading(true);
    try {
      const url =
        type === "monthly"
          ? `/api/monthly-targets?monthDashID=${monthID}`
          : `/api/weekly-targets?monthDashID=${monthID}&week=${week}`;
      const res = await api.get(url);
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetchLoading(false);
    }
  };

  const addTarget = async () => {
    if (!input.trim() || targets.length >= 10) return;
    setLoading(true);
    try {
      const url =
        type === "monthly"
          ? `/api/add-monthly-target?monthDashID=${monthID}`
          : `/api/add-weekly-target?monthDashID=${monthID}&week=${week}`;
      const res = await api.patch(url, { target: input.trim() });
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets);
        setInput("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeTarget = async (id: string) => {
    setRemoveLoading(id);
    try {
      const url =
        type === "monthly"
          ? `/api/remove-monthly-target?monthDashID=${monthID}&targetID=${id}`
          : `/api/remove-weekly-target?monthDashID=${monthID}&week=${week}&targetID=${id}`;
      const res = await api.patch(url);
      if (res?.data?.success) {
        setTargets((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRemoveLoading("");
    }
  };

  const markTarget = async (id: string, mark: boolean) => {
    setMarkLoading(id);
    try {
      const url =
        type === "monthly"
          ? `/api/mark-monthly-target?monthDashID=${monthID}&targetID=${id}`
          : `/api/mark-weekly-target?monthDashID=${monthID}&week=${week}&targetID=${id}`;
      const res = await api.patch(url, { mark });
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMarkLoading("");
    }
  };

  useEffect(() => {
    if (!monthID) return;
    setTargets([]);
    getTargets();
  }, [monthID, type, week]);

  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      {targets.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-violet-500 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] font-bold text-violet-400 shrink-0">
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
          onKeyDown={(e) => e.key === "Enter" && addTarget()}
          disabled={targets.length >= 10}
          placeholder={
            targets.length >= 10
              ? "Max 10 targets reached"
              : type === "monthly"
                ? "Add a monthly target…"
                : "Add a weekly target…"
          }
          className="flex-1 rounded-xl py-2 px-3 text-[12px] bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-violet-500/40 focus:bg-white/8 transition-all duration-200"
        />
        <button
          onClick={addTarget}
          disabled={loading || !input.trim() || targets.length >= 10}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[11px] font-semibold hover:bg-violet-500/30 transition-colors duration-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 rounded-full border border-violet-300 border-t-transparent animate-spin" />
          ) : (
            <FiPlus size={13} />
          )}
          Add
        </button>
      </div>

      {/* Target list */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto hide-scrollbar">
        {fetchLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 rounded-xl bg-white/5 animate-pulse" />
          ))
        ) : targets.length === 0 ? (
          <div className="flex flex-col items-center py-6 gap-2">
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
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200 group ${target.completed
                  ? "bg-emerald-500/8 border-emerald-500/20"
                  : "bg-white/2 border-white/8 hover:border-white/15"
                  }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => markTarget(target._id, !target.completed)}
                  disabled={markLoading === target._id}
                  className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all duration-200 cursor-pointer ${target.completed
                    ? "bg-emerald-500/30 border-emerald-500/50 text-emerald-400"
                    : "bg-white/5 border-white/15 hover:border-violet-500/40"
                    }`}
                >
                  {markLoading === target._id ? (
                    <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 border-t-transparent animate-spin" />
                  ) : target.completed ? (
                    <FiCheck size={10} />
                  ) : null}
                </button>

                {/* Text */}
                <p
                  className={`flex-1 text-[12px] leading-tight ${target.completed
                    ? "line-through text-gray-500"
                    : "text-white/80"
                    }`}
                >
                  {target.value}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeTarget(target._id)}
                  disabled={removeLoading === target._id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-5 h-5 flex items-center justify-center rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                >
                  {removeLoading === target._id ? (
                    <span className="w-2 h-2 rounded-full border border-rose-400 border-t-transparent animate-spin" />
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

export default TargetsSection
