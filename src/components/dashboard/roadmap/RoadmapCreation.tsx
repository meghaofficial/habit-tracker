import { useState } from "react";
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
  const [showBelow, setShowBelow] = useState(false);

  const trail = [{ id: "1", title: "New" }];

  return (
    // <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-4 sm:p-6 shadow-sm mt-4">
    //   <div className="w-full text-white min-h-[calc(100vh-120px)] flex flex-col">
    //     <div className="mx-auto w-full px-2 py-3 sm:px-4 flex flex-col flex-1">
    //       {/* Top Header / Actions Bar */}
    //       <header className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
    //         <div className="flex items-center gap-3">
    //           <button
    //             type="button"
    //             onClick={onBack}
    //             aria-label="Back to roadmaps"
    //             className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#161616] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
    //           >
    //             <ArrowLeft size={14} />
    //             <span>Back</span>
    //           </button>

    //           <div>
    //             <div className="flex items-center gap-2">
    //               <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg">
    //                 Roadmap Studio
    //               </h1>
    //               <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
    //                 <Sparkles size={11} />
    //                 Dual-Panel
    //               </span>
    //             </div>
    //             <p className="text-[11px] text-gray-400">
    //               Configure your roadmap on the left panel &bull; Drag divider
    //               to resize &bull; View horizontal zigzag path on the right
    //             </p>
    //           </div>
    //         </div>

    //         <div className="flex items-center gap-2">
    //           <button
    //             type="button"
    //             onClick={onBack}
    //             className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-white/5 hover:text-white cursor-pointer"
    //           >
    //             Cancel
    //           </button>

    //           <button
    //             type="button"
    //             // onClick={() => onSaveRoadmap?.(rootRoadmap)}
    //             className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 cursor-pointer"
    //           >
    //             <Save size={13} />
    //             <span>Save Roadmap</span>
    //           </button>
    //         </div>
    //       </header>

    //       {/* Resizable 2-Panel Container */}
    //       <div className="relative flex-1 flex flex-col lg:flex-row min-h-[640px] max-h-[82vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]">
    //         {/* Left Panel: CreateRoadmap */}
    //         <div
    //           className="h-full overflow-hidden"
    //           // style={{
    //           //   width: `${leftWidthPercent}%`,
    //           // }}
    //         >
    //           {/* <CreateRoadmap
    //             roadmap={activeRoadmap}
    //             onChangeRoadmap={handleUpdateActiveRoadmap}
    //             breadcrumbs={trail}
    //             onNavigateBreadcrumb={handleNavigateBreadcrumb}
    //             onOpenNestedRoadmap={handleOpenNestedRoadmap}
    //           /> */}
    //         </div>

    //         {/* Right Panel: ViewRoadmap */}
    //         <div
    //           className="h-full flex-1 overflow-hidden"
    //           // style={{
    //           //   width: `${100 - leftWidthPercent}%`,
    //           // }}
    //         >
    //           {/* <ViewRoadmap
    //             roadmap={activeRoadmap}
    //             breadcrumbs={trail}
    //             onNavigateBreadcrumb={handleNavigateBreadcrumb}
    //             onOpenNestedRoadmap={handleOpenNestedRoadmap}
    //             onToggleNodeComplete={handleToggleNodeComplete}
    //             onToggleTaskComplete={handleToggleTaskComplete}
    //           /> */}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] shadow-sm my-4">
      {/* Breadcrumb Bar */}
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

        {/* Below Nodes Section */}
        {showBelow && <div>section</div>}
      </div>
    </div>
  );
}
