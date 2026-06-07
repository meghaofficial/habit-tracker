import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { PiNotepad } from "react-icons/pi";
import { axiosPrivate } from "../../../api/axios";
import CircleLoader from "../../loaders/CircleLoader";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "../../shared/CutomButton";
import { socket } from "../../../socket/socket";

interface Target {
  _id: string;
  value: string;
  completed: boolean;
}

const TargetsList = ({
  type,
  monthID,
  week = 0,
}: {
  type: string;
  monthID: string;
  week?: number;
}) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [singleTarget, setSingleTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("0");
  const [removeLoading, setRemoveLoading] = useState("");
  const [addLoading, setAddLoading] = useState("");

  const addTarget = async () => {
    if (!singleTarget.trim()) return;
    setLoading(true);
    try {
      const url =
        type === "monthly"
          ? `/api/add-monthly-target?monthDashID=${monthID}`
          : `/api/add-weekly-target?monthDashID=${monthID}&week=${week}`;
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
  };

  const removeTarget = async (id: string) => {
    setRemoveLoading(id);
    try {
      const url =
        type === "monthly"
          ? `/api/remove-monthly-target?monthDashID=${monthID}&targetID=${id}`
          : `/api/remove-weekly-target?monthDashID=${monthID}&week=${week}&targetID=${id}`;
      const res = await axiosPrivate.patch(url);
      if (res?.data?.success) {
        setTargets((prev) => prev.filter((p) => p?._id !== id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRemoveLoading("");
    }
  };

  const markTarget = async (id: string, mark: boolean) => {
    setAddLoading(id);
    try {
      const url =
        type === "monthly"
          ? `/api/mark-monthly-target?monthDashID=${monthID}&targetID=${id}`
          : `/api/mark-weekly-target?monthDashID=${monthID}&week=${week}&targetID=${id}`;
      const res = await axiosPrivate.patch(url, { mark });
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddLoading("");
    }
  };

  const [getTargetsLoading, setGetTargetsLoading] = useState(false);
  const getTargets = async () => {
    setGetTargetsLoading(true);
    try {
      const url =
        type === "monthly"
          ? `/api/monthly-targets?monthDashID=${monthID}`
          : `/api/weekly-targets?monthDashID=${monthID}&week=${week}`;
      const res = await axiosPrivate.get(url);
      if (res?.data?.success) {
        setTargets(res?.data?.target?.targets || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGetTargetsLoading(false);
    }
  };

  useEffect(() => {
    if (!monthID) return;
    getTargets();
  }, [monthID, type, week]);

  useEffect(() => {
    if (targets?.length <= 0) return;
    const donePr = targets?.filter((t) => t?.completed === true).length ?? 0;
    const pr = ((donePr / targets?.length) * 100).toFixed(2);
    setProgress(pr);
  }, [targets]);

  // WEBSOCKET SYNCING
  useEffect(() => {
    const onTargetAdded = (data: any) => {
      setTargets(data?.target?.targets);
    };
    const onTargetRemoved = (data: any) => {
      setTargets(data?.target?.targets);
    };
    const onTargetMarked = (data: any) => {
      setTargets(data?.target?.targets);
    };
    socket.on("add-monthly-target", onTargetAdded);
    socket.on("remove-monthly-target", onTargetRemoved);
    socket.on("mark-monthly-target", onTargetMarked);
    return () => {
      socket.off("add-monthly-target", onTargetAdded);
      socket.off("remove-monthly-target", onTargetRemoved);
      socket.on("mark-monthly-target", onTargetMarked);
    };
  }, []);

  return (
    <>
      <div
        className={`relative overflow-x-hidden rounded-2xl h-fit google-sans border border-white/10 sm:w-1/3 light:border-black/10 bg-black/20 light:bg-lightCard p-5`}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-[18px] font-bold text-white light:text-lightText">
            Monthly Targets
          </p>
          <div className="w-[25%] flex items-center gap-2">
            <DarkProgressBar progress={Number(progress)} />
            <p className="text-[13px] font-semibold">
              {targets.filter((t) => t.completed).length}/{targets?.length}
            </p>
          </div>
        </div>
        <div className={`overflow-y-auto hide-scrollbar`}>
          {/* Input Section */}
          <div className="relative z-10 flex gap-3">
            <input
              disabled={targets?.length >= 10}
              type="text"
              value={singleTarget}
              onChange={(e) => setSingleTarget(e.target.value)}
              placeholder={
                type === "monthly"
                  ? "Add monthly target..."
                  : "Add weekly target..."
              }
              className="flex-1 w-[70%] rounded-lg py-2.5 border border-white/10 bg-white/4 light:bg-black/5 light:border-black/10 px-4 text-[14px] text-white outline-none placeholder:text-white/25 light:placeholder:text-black/25 transition-all duration-300 focus:border-[#8B5CF6]/40 focus:bg-white/6 focus:shadow-[0_0_25px_rgba(139,92,246,0.15)] light:text-lightText"
            />
            <CustomButton
              onClick={() => {
                if (loading) return;
                addTarget();
              }}
              disabled={targets?.length >= 10}
              title={
                targets?.length >= 10 ? "Can not add more than 10 targets" : ""
              }
              styling="w-auto py-2"
              rounded="rounded-lg"
              textSize="13px"
            >
              <span className="relative z-10 text-nowrap font-normal">
                {loading ? <CircleLoader /> : "Add Target"}
              </span>
            </CustomButton>
          </div>

          {/* Targets */}
          <div className="relative z-10 mt-4 pr-1 h-96.5 overflow-y-auto hide-scrollbar">
            {getTargetsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-lg border border-white/10 bg-white/4 light:bg-black/5 light:border-black/10"
                  />
                ))}
              </div>
            ) : (
              <div>
                {targets?.length > 0 ? (
                  targets?.map((target, index) => (
                    <div
                      key={target?._id}
                      className="group light:bg-black/5 light:border-black/10 relative mb-3 overflow-hidden rounded-lg border border-white/10 bg-white/4 p-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/6"
                    >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute inset-0 bg-linear-to-r from-[#6366F1]/5 via-transparent to-[#A855F7]/5" />
                      </div>

                      <div className="relative z-10 flex items-center justify-between gap-4">
                        {/* Left */}
                        <div className="flex items-center gap-4">
                          <div className=" flex h-5 w-5 items-center justify-center rounded bg-white shadow-lg text-[13px] font-bold text-black">
                            {index + 1}
                          </div>

                          <span
                            className={`max-w-55 text-[15px] font-medium transition-all duration-300 line-clamp-1 ${target?.completed ? "text-white/35 light:text-black/35 line-through" : "text-white light:text-lightText"} `}
                          >
                            {target?.value}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {addLoading === target?._id ? (
                            <CircleLoader />
                          ) : (
                            <input
                              type="checkbox"
                              checked={target?.completed}
                              onChange={() => {
                                if (addLoading) return;
                                markTarget(target?._id, !target?.completed);
                              }}
                              className={`h-4 w-4 ${addLoading ? "cursor-not-allowed" : "cursor-pointer"} accent-[#8B5CF6]`}
                            />
                          )}
                          {removeLoading === target?._id ? (
                            <CircleLoader />
                          ) : (
                            <button
                              onClick={() => {
                                if (removeLoading) return;
                                removeTarget(target?._id);
                              }}
                              className="flex h-5 w-5 items-center justify-center rounded bg-white/4 text-white/40 light:text-black/40 transition-all duration-300 hover:bg-red-500/15 hover:text-red-400"
                            >
                              <RxCross2 className="text-[16px]" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/3 text-center ">
                    <div className=" flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#6366F1]/20 to-[#A855F7]/20 text-[#8B5CF6] shadow-[0_20px_50px_rgba(99,102,241,0.15)] ">
                      <PiNotepad className="text-[54px]" />
                    </div>

                    <p className="mt-6 text-[20px] font-bold text-white light:text-lightText">
                      No Targets Yet
                    </p>

                    <p className="px-4 mt-2 max-w-70 text-[14px] leading-6 text-darkSubText light:text-lightSubText">
                      {type === "monthly"
                        ? "Add monthly goals to stay focused and productive."
                        : "Create weekly targets and build consistency."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

interface ProgressBarProps {
  progress: number; // Value between 0 and 100
}

function DarkProgressBar({ progress }: ProgressBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Ensure progress stays within 0-100 bounds
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      className="relative w-full h-1.5 bg-[#A3A3A3] rounded-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Progress Fill */}
      <motion.div
        className="absolute top-0 left-0 h-full bg-linear-to-r bg-white light:bg-black rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Invisible Anchor Point at the Tip for Tooltip Alignment */}
      <motion.div
        className="absolute top-0 h-full"
        initial={{ left: 0 }}
        animate={{ left: `${clampedProgress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Smooth Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 6, scale: 0.95, x: "-50%" }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute bottom-6 left-0 px-2.5 py-1 text-xs font-semibold text-white bg-zinc-900 border border-zinc-700 rounded-md shadow-xl whitespace-nowrap pointer-events-none"
            >
              {clampedProgress}%
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-r border-b border-zinc-700 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default TargetsList;
