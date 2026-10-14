// import { useState, type Dispatch, type SetStateAction } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiPlus,
//   FiArrowRight,
//   FiTrash2,
//   FiGitBranch,
//   FiClock,
// } from "react-icons/fi";
// import type { RoadmapI } from "../../../types";

// // Default Preset Images for Roadmaps
// const PRESET_IMAGES = [
//   {
//     label: "Data Structures & Algorithms",
//     url: "https://images.unsplash.com/photo-1516116211223-4258d6968335?w=800&auto=format&fit=crop&q=80",
//     category: "Computer Science",
//   },
//   {
//     label: "Fullstack Web Development",
//     url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
//     category: "Web Development",
//   },
//   {
//     label: "AI & Machine Learning",
//     url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
//     category: "Artificial Intelligence",
//   },
//   {
//     label: "System Design & Architecture",
//     url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
//     category: "System Architecture",
//   },
//   {
//     label: "Mobile App Engineering",
//     url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
//     category: "Mobile Dev",
//   },
//   {
//     label: "DevOps & Cloud Infrastructure",
//     url: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80",
//     category: "DevOps",
//   },
// ];

// const INITIAL_ROADMAPS: RoadmapI[] = [
//   {
//     _id: "rm-1",
//     title: "Data Structures & Algorithms",
//     description: "Master essential algorithms, dynamic programming, tree traversals, and graph patterns for top-tier technical interviews.",
//     image: PRESET_IMAGES[0].url,
//     category: "Computer Science",
//     status: "Completed",
//     totalNodes: 16,
//     completedNodes: 12,
//     updatedAt: "Updated 2 days ago",
//   },
//   {
//     _id: "rm-2",
//     title: "Fullstack Web Mastery",
//     description: "Build production-grade applications using React, TypeScript, Node.js, Next.js, and modern cloud database architecture.",
//     image: PRESET_IMAGES[1].url,
//     category: "Web Development",
//     status: "In Progress",
//     totalNodes: 24,
//     completedNodes: 18,
//     updatedAt: "Updated 1 day ago",
//   },
//   {
//     _id: "rm-3",
//     title: "AI & Machine Learning Foundations",
//     description: "Deep dive into neural networks, PyTorch fundamentals, computer vision, and Large Language Model fine-tuning techniques.",
//     image: PRESET_IMAGES[2].url,
//     category: "Artificial Intelligence",
//     status: "In Progress",
//     totalNodes: 14,
//     completedNodes: 6,
//     updatedAt: "Updated 4 days ago",
//   },
//   {
//     _id: "rm-4",
//     title: "System Design & Distributed Systems",
//     description: "Learn how to design scalable, fault-tolerant microservices, caching strategies, load balancing, and rate limiting systems.",
//     image: PRESET_IMAGES[3].url,
//     category: "System Architecture",
//     status: "Draft",
//     totalNodes: 10,
//     completedNodes: 2,
//     updatedAt: "Updated 5 days ago",
//   },
// ];

// const RoadmapsList = ({setOpenRoadmap}:{setOpenRoadmap: Dispatch<SetStateAction<boolean>>;}) => {
//   const [roadmaps, setRoadmaps] = useState<RoadmapI[]>(INITIAL_ROADMAPS);

//   const handleDeleteRoadmap = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setRoadmaps(roadmaps.filter((rm) => rm._id !== id));
//   };

//   return (
//     <div className="flex flex-col gap-5 w-full text-white mb-4 mt-6">

//       {/* 4. ROADMAPS GRID / CARDS DISPLAY */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//         {/* Quick "+ Create New Roadmap" Card */}
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => setOpenRoadmap(true)}
//           className="relative rounded-2xl border-2 border-dashed border-white/15 hover:border-indigo-500/50 bg-black/10 hover:bg-indigo-500/5 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-70 group overflow-hidden"
//         >
//           <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3.5 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
//             <FiPlus size={26} />
//           </div>
//           <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
//             Create New Roadmap
//           </h3>
//           <p className="text-xs text-gray-400 mt-1 max-w-55">
//             Design a custom step-by-step learning path with nodes, topics, and milestones.
//           </p>
//         </motion.div>

//         {/* Existing Roadmap Cards */}
//         <AnimatePresence>
//           {roadmaps.map((rm, i) => {
//             const progressPct =
//               rm.totalNodes > 0
//                 ? Math.round((rm.completedNodes / rm.totalNodes) * 100)
//                 : 0;

//             return (
//               <motion.div
//                 key={rm._id}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 transition={{ duration: 0.35, delay: i * 0.05 }}
//                 className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between"
//               >
//                 {/* Background Ambient Light */}
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

//                 <div>
//                   {/* IMAGE HEADER CONTAINER */}
//                   <div className="relative h-36 w-full overflow-hidden rounded-t-2xl bg-gray-900">
//                     <img
//                       src={rm.image}
//                       alt={rm.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     />
//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/30 to-transparent" />

//                     {/* Top Badges */}
//                     <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
//                       <div></div>
//                       <span
//                         className={`px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md border shadow-md ${rm.status === "In Progress"
//                             ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
//                             : rm.status === "Completed"
//                               ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
//                               : "bg-amber-500/20 text-amber-300 border-amber-500/40"
//                           }`}
//                       >
//                         {rm.status}
//                       </span>
//                     </div>

//                     {/* Delete Icon Button (Hover reveal) */}
//                     <button
//                       onClick={(e) => handleDeleteRoadmap(rm._id, e)}
//                       className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
//                       title="Delete Roadmap"
//                     >
//                       <FiTrash2 size={14} />
//                     </button>
//                   </div>

//                   {/* CARD BODY CONTENT */}
//                   <div className="p-4 sm:p-5 flex flex-col gap-3">
//                     <div>
//                       <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
//                         {rm.title}
//                       </h3>
//                       {/* <p className="text-xs text-gray-400 line-clamp-2 mt-1 min-h-9 leading-relaxed">
//                         {rm.description}
//                       </p> */}
//                     </div>

//                     {/* Node Progress Bar */}
//                     <div className="mt-1 flex flex-col gap-1.5">
//                       <div className="flex items-center justify-between text-[11px] font-medium text-gray-300">
//                         <span className="flex items-center gap-1 text-gray-400">
//                           <FiGitBranch size={12} className="text-indigo-400" />
//                           {rm.completedNodes} / {rm.totalNodes} Nodes
//                         </span>
//                         <span className="text-indigo-300 font-bold">
//                           {progressPct}%
//                         </span>
//                       </div>
//                       <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
//                         <div
//                           className="bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
//                           style={{ width: `${progressPct}%` }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* CARD FOOTER */}
//                 <div className="px-4 sm:px-5 pb-4 pt-2 flex items-center justify-between border-t border-white/5 text-[11px] text-gray-400">
//                   <span className="flex items-center gap-1.5">
//                     <FiClock size={11} className="text-gray-500" />
//                     {rm.updatedAt}
//                   </span>
//                   <button className="flex items-center gap-1 font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors cursor-pointer">
//                     <span>View Roadmap</span>
//                     <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
//                   </button>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>
//       </div>

//     </div>
//   );
// };

// export default RoadmapsList;

"use client";

import { useState } from "react";
import { Plus, GitBranch, ChevronRight } from "lucide-react";
import RoadmapPage from "./RoadmapPage";

type Roadmap = {
  id: string;
  title: string;
  icon: string;
  completed: number;
  total: number;
  color: string;
};

const initialRoadmaps: Roadmap[] = [
  {
    id: "1",
    title: "System Design",
    icon: "🏗️",
    completed: 8,
    total: 20,
    color: "#8b5cf6",
  },
  {
    id: "2",
    title: "AI Engineer",
    icon: "🤖",
    completed: 4,
    total: 16,
    color: "#10b981",
  },
  {
    id: "3",
    title: "Full-Stack Development",
    icon: "💻",
    completed: 6,
    total: 18,
    color: "#38bdf8",
  },
  {
    id: "4",
    title: "Google L3 Preparation",
    icon: "🎯",
    completed: 12,
    total: 30,
    color: "#f59e0b",
  },
];

export default function RoadmapsList() {
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);
  const [showRoadmapPage, setShowRoadmapPage] = useState(false);

  if (showRoadmapPage) {
    return (
      <RoadmapPage
        onBack={() => setShowRoadmapPage(false)}
        onSave={(title) => {
          setRoadmaps((previous) => [
            ...previous,
            {
              id: crypto.randomUUID(),
              title,
              icon: "🗺️",
              completed: 0,
              total: 0,
              color: "#a78bfa",
            },
          ]);

          setShowRoadmapPage(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] px-4 py-6 text-white sm:px-6">
      <main className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight">My Roadmaps</h1>

          <button
            onClick={() => setShowRoadmapPage(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-emerald-400 sm:px-4 sm:text-sm"
          >
            <Plus size={16} />
            New roadmap
          </button>
        </div>

        {/* Compact roadmap cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => {
            const progress =
              roadmap.total > 0
                ? Math.round((roadmap.completed / roadmap.total) * 100)
                : 0;

            return (
              <button
                key={roadmap.id}
                type="button"
                className="group flex h-[76px] items-center gap-3 rounded-xl border border-white/[0.12] bg-[#191919] px-3 text-left transition hover:border-white/25 hover:bg-[#1e1e1e]"
                style={{
                  borderLeftWidth: "2px",
                  borderLeftColor: roadmap.color,
                }}
              >
                {/* Roadmap icon */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-base"
                  style={{
                    color: roadmap.color,
                    borderColor: `${roadmap.color}40`,
                    backgroundColor: `${roadmap.color}12`,
                  }}
                >
                  <GitBranch size={18} />
                </div>

                {/* Title and progress */}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-gray-100">
                      {roadmap.title}
                    </span>

                    <span
                      className="shrink-0 text-[10px] font-medium tabular-nums"
                      style={{ color: roadmap.color }}
                    >
                      {progress}%
                    </span>
                  </div>

                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: roadmap.color,
                      }}
                    />
                  </div>
                </div>

                <ChevronRight
                  size={14}
                  className="shrink-0 text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-gray-300"
                />
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
