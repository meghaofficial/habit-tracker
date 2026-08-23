import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiCheck, FiPlus, FiTarget, FiX } from "react-icons/fi";
import type { TargetI } from "../../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTarget,
  getTargets,
  markTarget,
  removeTarget,
} from "../../../api/dashboard.api";
import SectionIcon from "../../shared/SectionIcon";

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
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === tab.key
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
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
};

const InlineTargetsList = ({
  monthID,
  type,
  week,
}: {
  monthID: string;
  type: string;
  week: number;
}) => {
  const [input, setInput] = useState("");
  const [markLoading, setMarkLoading] = useState("");
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["targets", type, monthID, week],
    queryFn: () =>
      getTargets({
        type,
        monthID,
        week,
      }),
  });
  const targets = data?.target?.targets ?? [];

  const completedCount = targets.filter((t: TargetI) => t.completed).length;
  const progress =
    targets.length > 0
      ? Math.round((completedCount / targets.length) * 100)
      : 0;

  const addTargetMutation = useMutation({
    mutationFn: addTarget,
    onSuccess: (data) => {
      queryClient.setQueryData(["targets", type, monthID, week], data);
      setInput("");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleAddTarget = () => {
    if (!input.trim() || targets.length >= 10) return;
    addTargetMutation.mutate({
      type,
      monthID,
      week,
      target: input.trim(),
    });
  };

  const removeTargetMutation = useMutation({
    mutationFn: removeTarget,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["targets", type, monthID, week],
        (old: any) => ({
          ...old,
          target: {
            ...old.target,
            targets: old.target.targets.filter(
              (t: TargetI) => t._id !== variables.targetID,
            ),
          },
        }),
      );
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const removingId = removeTargetMutation.isPending
    ? removeTargetMutation.variables?.targetID
    : "";

  const markTargetMutation = useMutation({
    mutationFn: markTarget,
    onMutate: ({ targetID }) => {
      setMarkLoading(targetID);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["targets", type, monthID, week], data);
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      setMarkLoading("");
    },
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      {targets.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] font-bold text-indigo-400 shrink-0">
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
          onKeyDown={(e) => e.key === "Enter" && handleAddTarget()}
          disabled={targets.length >= 10}
          placeholder={
            targets.length >= 10
              ? "Max 10 targets reached"
              : type === "monthly"
                ? "Add a monthly target…"
                : "Add a weekly target…"
          }
          className="flex-1 rounded-xl py-2 px-3 text-[12px] bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-indigo-500/40 focus:bg-white/8 transition-all duration-200"
        />
        <button
          onClick={() => {
            if (!input.trim() || targets.length >= 10) return;
            handleAddTarget();
          }}
          disabled={
            addTargetMutation.isPending || !input.trim() || targets.length >= 10
          }
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold hover:bg-indigo-500/30 transition-colors duration-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {addTargetMutation.isPending ? (
            <span className="w-3.5 h-3.5 rounded-full border border-indigo-300 border-t-transparent animate-spin" />
          ) : (
            <FiPlus size={13} />
          )}
          Add
        </button>
      </div>

      {/* Target list */}
      <div className="flex flex-col gap-2 max-h-70 overflow-y-auto hide-scrollbar">
        {isPending ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 rounded-xl bg-white/5 animate-pulse" />
          ))
        ) : targets.length === 0 ? (
          <div className="flex flex-col items-center py-6 gap-2 justify-center h-70">
            <FiTarget size={24} className="text-gray-600" />
            <p className="text-[11px] text-gray-500">
              No targets yet. Add one above.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {targets.map((target: TargetI) => (
              <motion.div
                key={target._id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200 group ${
                  target.completed
                    ? "bg-emerald-500/8 border-emerald-500/20"
                    : "bg-white/2 border-white/8 hover:border-white/15"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() =>
                    markTargetMutation.mutate({
                      type,
                      monthID,
                      week,
                      targetID: target._id,
                      mark: !target.completed,
                    })
                  }
                  disabled={markLoading === target._id}
                  className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    target.completed
                      ? "bg-emerald-500/30 border-emerald-500/50 text-emerald-400"
                      : "bg-white/5 border-white/15 hover:border-indigo-500/40"
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
                  className={`flex-1 text-[12px] leading-tight ${
                    target.completed
                      ? "line-through text-gray-500"
                      : "text-white/80"
                  }`}
                >
                  {target.value}
                </p>

                {/* Remove */}
                <button
                  onClick={() =>
                    removeTargetMutation.mutate({
                      type,
                      monthID,
                      week,
                      targetID: target._id,
                    })
                  }
                  disabled={removingId === target._id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-5 h-5 flex items-center justify-center rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                >
                  {removingId === target._id ? (
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

export default TargetsSection;
