import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { RoadmapData } from "./types";
import { useNavigate } from "react-router-dom";
import CreationForm from "./components/CreationForm";
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
      <div className="flex flex-wrap items-center gap-3 p-4 text-xs text-gray-400 border-b border-white/8">
        <button
          type="button"
          onClick={() => navigate("/roadmap")}
          aria-label="Back to roadmaps"
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#161616] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        {trail.map((crumb, idx) => {
          const isLast = idx === trail.length - 1;
          return (
            <React.Fragment key={crumb.id + idx}>
              <button
                type="button"
                // onClick={() => handleNavigateBreadcrumb(crumb.title)}
                className={`font-medium transition hover:text-white ${
                  isLast
                    ? "text-emerald-400 font-semibold"
                    : "text-gray-400 hover:underline"
                }`}
              >
                {crumb.title || "Untitled"}
              </button>
              {!isLast && <span className="text-gray-600 font-bold">/</span>}
            </React.Fragment>
          );
        })}
      </div>
      <div className="p-4 sm:p-6">
        {/* ENWRAP THIS IN CREATE ROADMAP */}

        {/* Main Roadmap Metadata Inputs */}
        {/* <CreationForm /> */}
        <RoadmapTree />

        {/* Below Nodes Section */}
        {showBelow && <div>section</div>}

        {/* Nodes List Section */}
        {/* <div className="mt-5 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Roadmap Nodes ({roadmap.nodes.length})
            </h3>
            <span className="text-[10px] text-gray-500">
              Arranged in horizontal zigzag on preview
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenAddNode}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Node</span>
          </button>
        </div>

        {roadmap.nodes.length === 0 ? (
          <div className="mt-3 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-6 text-center">
            <Sparkles size={24} className="text-gray-500 mb-2" />
            <p className="text-xs font-medium text-gray-300">
              No nodes added yet
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Click &quot;Add Node&quot; to add a single node, sequential tasks,
              or nested roadmap.
            </p>
            <button
              type="button"
              onClick={handleOpenAddNode}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer"
            >
              <Plus size={13} />
              Add First Node
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {roadmap.nodes.map((node, index) => {
              return (
                <div
                  key={node.id}
                  className="group relative flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#171717] p-3 transition hover:border-white/20 hover:bg-[#1b1b1b]"
                  style={{
                    borderLeftColor: node.color,
                    borderLeftWidth: "3px",
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-base shrink-0">{node.icon}</span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-gray-100 truncate">
                          {node.title}
                        </span>

                        {node.type === "single" && (
                          <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[9px] font-medium text-blue-400">
                            Single Node
                          </span>
                        )}

                        {node.type === "sequential" && (
                          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-medium text-amber-400">
                            Sequential ({node.tasks?.length || 0} tasks)
                          </span>
                        )}

                        {node.type === "nested" && (
                          <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[9px] font-medium text-purple-400">
                            Nested Roadmap (/)
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-500">
                        <span>Node #{index + 1}</span>
                        {node.type === "single" && (
                          <span>
                            {node.completed ? "✓ Marked Done" : "Incomplete"}
                          </span>
                        )}
                        {node.type === "sequential" && (
                          <span>
                            {node.tasks?.filter((t) => t.completed).length || 0}
                            /{node.tasks?.length || 0} tasks done
                          </span>
                        )}
                        {node.type === "nested" && (
                          <span>
                            {node.nestedRoadmap?.nodes.length || 0} sub-nodes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  Actions
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {node.type === "nested" && (
                      <button
                        type="button"
                        // onClick={() => onOpenNestedRoadmap(node.id)}
                        title="Edit Nested Roadmap (/)"
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-500/15 border border-purple-500/30 px-2 py-1 text-[11px] font-medium text-purple-300 hover:bg-purple-500/25 transition cursor-pointer"
                      >
                        <span>Edit Sub-Roadmap</span>
                        <ChevronRight size={12} />
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={index === 0}
                      // onClick={() => handleMoveNode(index, "up")}
                      title="Move Up"
                      className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    >
                      <ArrowUp size={13} />
                    </button>

                    <button
                      type="button"
                      // disabled={index === roadmap.nodes.length - 1}
                      // onClick={() => handleMoveNode(index, "down")}
                      title="Move Down"
                      className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    >
                      <ArrowDown size={13} />
                    </button>

                    <button
                      type="button"
                      // onClick={() => handleEditNode(node)}
                      title="Edit Node"
                      className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                    >
                      <Edit3 size={13} />
                    </button>

                    <button
                      type="button"
                      // onClick={() => handleDeleteNode(node.id)}
                      title="Delete Node"
                      className="rounded p-1 text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div> */}
      </div>
    </div>
  );
}
