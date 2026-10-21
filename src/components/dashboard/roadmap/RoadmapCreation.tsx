import { ArrowLeft } from "lucide-react";
import type { RoadmapData } from "./types";
import { useNavigate } from "react-router-dom";
import RoadmapTree from "./RoadmapTree";

export type RoadmapCreationProps = {
  onBack: () => void;
  onSaveRoadmap?: (roadmap: RoadmapData) => void;
};

export default function RoadmapCreation() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] shadow-sm my-4">
      {/* Upper Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 text-xs border-b border-white/8">
        <button
          type="button"
          onClick={() => navigate("/roadmap")}
          aria-label="Back to roadmaps"
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#161616] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <div className="ml-1">
          <h1 className="text-lg font-semibold">Roadmap Builder</h1>
          <p className="text-xs text-gray-500">
            Create nested roadmaps and lists.
          </p>
        </div>
      </div>
      <div className="p-2 sm:p-4">
        <RoadmapTree />
      </div>
    </div>
  );
}
