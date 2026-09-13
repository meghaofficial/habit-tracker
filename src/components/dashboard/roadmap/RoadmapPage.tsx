import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import RoadmapCanvas from "./RoadmapCanvas";
import Thumbnail from "./Thumbnail";
import RoadmapGuide from "./RoadmapGuide";

const RoadmapPage = ({
  setOpenRoadmap,
}: {
  setOpenRoadmap: Dispatch<SetStateAction<boolean>>;
}) => {
  // const dummyMilestone = {
  //   title: "Data Structures",
  //   description: "Build a strong foundation in core data structures.",
  //   completedChildren: 3,
  //   totalChildren: 5,
  //   isActive: true,
  //   isExpanded: false,
  // };

  return (
    <div className="w-full mb-4">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between gap-6 pb-5 border-b border-white/[0.07] light:border-black/[0.07]">
        <div className="flex items-center gap-4 min-w-0">
          {/* Back */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setOpenRoadmap(false)}
            className="group flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/[0.07] bg-white/2.5 text-zinc-500 transition-all duration-300 hover:border-indigo-400/15 hover:bg-indigo-500/6 hover:text-indigo-400 light:border-black/[0.07] light:bg-black/2.5 light:text-slate-500"
            aria-label="Back to home"
          >
            <FiArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </motion.button>

          <Thumbnail />

          {/* Roadmap information */}
          <div className="min-w-0">
            <input
              type="text"
              defaultValue="New Roadmap"
              className="w-full max-w-[320px] bg-transparent text-lg font-semibold text-white outline-none placeholder:text-zinc-600 light:text-slate-900"
              placeholder="Roadmap name"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Build your learning path step by step
            </p>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/2.5 px-3 text-xs font-medium text-zinc-400 transition hover:border-indigo-400/15 hover:bg-indigo-500/5 hover:text-indigo-400 light:border-black/[0.07] light:text-slate-500"
          >
            <FiSettings className="h-3.5 w-3.5" />
            Settings
          </motion.button> */}
          <RoadmapGuide />
        </div>
      </div>
      {/* <Milestone
        title={dummyMilestone.title}
        completedChildren={dummyMilestone.completedChildren}
        totalChildren={dummyMilestone.totalChildren}
      /> */}
      <RoadmapCanvas />
    </div>
  );
};

export default RoadmapPage;
