import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import Canvas from "./Canvas";
import { useState } from "react";
import type { NodeI } from "../../../types";
import { RiResetRightLine } from "react-icons/ri";

const RoadmapCanvas = () => {
  const [nodes, setNodes] = useState<NodeI[]>([]);

  return (
    <>
      <div className="relative mt-5 h-130 overflow-hidden rounded-xl border border-white/[0.07] bg-[#09090b] light:border-black/[0.07] light:bg-[#fafafa]">
        {/* Canvas toolbar */}
        <button
          type="button"
          onClick={() => setNodes([])}
          className={` absolute top-4 ${nodes.length > 0 ? "left-4" : "left-33"} z-50 w-9 h-9 rounded-lg flex items-center justify-center border shadow-lg transition-colors text-indigo-400 border-indigo-400/20 bg-indigo-500/10 `}
          title="Reset Roadmap"
        >
          <RiResetRightLine size={15} />
        </button>
        {nodes.length <= 0 && (
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex h-9 items-center gap-2 rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 text-xs font-semibold text-indigo-400 shadow-lg shadow-indigo-950/10 transition hover:bg-indigo-500/15"
              onClick={() =>
                setNodes([
                  {
                    id: 1,
                    text: "Start Here",
                    x: 80,
                    y: 80,
                  },
                ])
              }
            >
              <FiPlus className="h-4 w-4" />
              Add Node
            </motion.button>
          </div>
        )}

        {/* Canvas info */}
        <div className="absolute right-4 top-4 z-10 rounded-lg border border-white/[0.07] bg-black/30 px-3 py-2 text-[10px] text-zinc-500 backdrop-blur-sm light:border-black/[0.07] light:bg-white/70">
          <span className="text-zinc-400">{nodes.length}</span> nodes
          <span className="mx-2 text-zinc-700">•</span>
          <span className="text-zinc-400">{nodes.length <= 0 ? 0 : nodes.length - 1}</span> connections
        </div>

        {/* Dotted canvas */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(161,161,170,0.35) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <Canvas nodes={nodes} setNodes={setNodes} />

        {/* Empty state / nodes go here */}
        <div className="relative flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/5 text-indigo-400">
              <FiPlus className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-zinc-400">
              Start building your roadmap
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Add your first node to create a learning path
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoadmapCanvas;
