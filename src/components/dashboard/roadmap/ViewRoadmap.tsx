import React, {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Check,
  ChevronRight,
  ListOrdered,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Play,
} from "lucide-react";
import type { RoadmapItem } from "./types";
import { useNavigate, useParams } from "react-router-dom";
import { roadmapApi } from "../../../api/roadmap.api";
import CircleLoader from "../../loaders/CircleLoader";

export type ViewRoadmapProps = {
  roadmap: RoadmapItem;
  setRoadmap: Dispatch<SetStateAction<RoadmapItem>>;
  onOpenNestedRoadmap: (nodeId: string) => void;
  onToggleTaskComplete?: (nodeId: string, taskId: string) => void;
};

const FADE_ARROW_COLOR = "#FFFFFF80";

export default function ViewRoadmap({
  roadmap,
  setRoadmap,
  onOpenNestedRoadmap,
  onToggleTaskComplete,
}: ViewRoadmapProps) {
  const navigate = useNavigate();
  const params = useParams();
  // State for expanded sequential task checklists
  const [expandedNodeIds, setExpandedNodeIds] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(false);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodeIds((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Calculate overall progress across all nodes
  const stats = useMemo(() => {
    let completedPoints = 0;
    let totalPoints = 0;

    const percentage =
      totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

    return {
      completedPoints,
      totalPoints,
      percentage,
    };
  }, [roadmap.nodes]);

  // Organize nodes into rows for horizontal zigzag (serpentine) layout
  const NODES_PER_ROW = 4;
  const rows = useMemo(() => {
    const result: RoadmapItem[][] = [];
    for (let i = 0; i < roadmap.nodes.length; i += NODES_PER_ROW) {
      result.push(roadmap.nodes.slice(i, i + NODES_PER_ROW));
    }
    return result;
  }, [roadmap.nodes]);

  const splat = params["*"];

  const handleStatusChange = async (parentID: string, childID: string) => {
    try {
      setLoading(true);

      await roadmapApi.startRoadmap(parentID, childID);

      setRoadmap((prev: RoadmapItem) => ({
        ...prev,
        status: "in-progress",
        nodes: prev.nodes.map((node, index) =>
          index === 0 ? { ...node, status: "in-progress" } : node,
        ),
      }));
    } catch (error) {
      console.error("Failed to start roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Preview Info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl shadow-lg border border-white/10"
            // style={{
            //   backgroundColor: `${roadmap.accent_color}25`,
            //   borderColor: `${roadmap.accent_color}`,
            // }}
          >
            {roadmap.icon || "🚀"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-white tracking-tight sm:text-lg">
                {roadmap.title || "Untitled Roadmap"}
              </h1>
              {roadmap.category && (
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-gray-300">
                  {roadmap.category}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-400 line-clamp-2">
              {roadmap.description || "No description provided yet."}
            </p>
          </div>
        </div>
        {roadmap.nodes.length > 0 && (
          <>
            {roadmap.status === "in-progress" ? (
              <div className="shrink-0 min-w-40 rounded-xl border border-white/8 bg-[#171717] px-3.5 py-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-gray-400">Progress</span>
                  <span className="font-bold text-emerald-400">
                    {stats.percentage}%
                  </span>
                </div>

                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>

                <div className="mt-1 text-right text-[9px] text-gray-500">
                  {stats.completedPoints}/{stats.totalPoints} milestones
                  completed
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!loading) {
                    handleStatusChange(roadmap._id, roadmap.nodes[0]._id);
                  }
                }}
                className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1.5 min-w-25 text-[11px] font-semibold text-emerald-400 transition hover:bg-emerald-400/20"
              >
                {loading ? (
                  <CircleLoader className="h-4 w-4" />
                ) : (
                  <>
                    <Play size={13} />
                    Start Roadmap
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Zigzag Serpentine Path View */}
      <div>
        {roadmap.type === "roadmap" ? (
          <div className="mt-3 flex-1">
            {roadmap.nodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-12 text-center">
                <Sparkles size={32} className="text-gray-600 mb-2" />
                <h4 className="text-sm font-semibold text-gray-300">
                  Your roadmap canvas is empty
                </h4>
                <p className="mt-1 text-xs text-gray-500 max-w-sm">
                  Add nodes on the left panel to see them flow horizontally in a
                  zigzag pattern across the screen.
                </p>
              </div>
            ) : (
              <div className="">
                {rows.map((rowNodes, rowIndex) => {
                  const isEvenRow = rowIndex % 2 === 0;
                  const isLastRow = rowIndex === rows.length - 1;

                  // Row nodes: if odd row, reverse them visually to go Right -> Left
                  // while preserving their sequential logic
                  const displayNodes = isEvenRow
                    ? rowNodes
                    : [...rowNodes].reverse();

                  return (
                    <div key={"row-" + rowIndex} className="relative">
                      {/* Nodes in this row */}
                      <div
                        className={`grid gap-x-2.5 ${
                          rowNodes.length === 1
                            ? "grid-cols-1 sm:grid-cols-3"
                            : rowNodes.length === 2
                              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                        }`}
                      >
                        {displayNodes.map((node, nodeIndexInDisplay) => {
                          // Determine actual sequence index
                          const actualIndex = isEvenRow
                            ? rowIndex * NODES_PER_ROW + nodeIndexInDisplay
                            : rowIndex * NODES_PER_ROW +
                              (rowNodes.length - 1 - nodeIndexInDisplay);

                          // Calculate node specific progress
                          let nodePercentage = 0;
                          let isNodeDone = false;

                          if (node.type === "list") {
                            const total = node.nodes?.length || 0;
                            const done =
                              node.points?.filter((t) => t.completed).length ||
                              0;
                            nodePercentage =
                              total > 0 ? Math.round((done / total) * 100) : 0;
                            isNodeDone = total > 0 && done === total;
                          } else {
                            // const subNodes = node.nestedRoadmap?.nodes || [];
                            // const done = subNodes.filter((sn) =>
                            //   sn.type === "single"
                            //     ? sn.completed
                            //     : sn.tasks?.every((t) => t.completed),
                            // ).length;
                            // nodePercentage =
                            //   subNodes.length > 0
                            //     ? Math.round((done / subNodes.length) * 100)
                            //     : 0;
                            // isNodeDone =
                            //   subNodes.length > 0 && done === subNodes.length;
                          }

                          const isExpanded = !!expandedNodeIds[node._id];

                          return (
                            <div className="flex gap-x-2.5 min-h-30">
                              <article
                                key={node._id}
                                className={`group relative w-full flex flex-col justify-between overflow-hidden rounded-xl border transition-all duration-300 p-3 shadow-md
                              ${
                                node.status === "completed"
                                  ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700/60 hover:bg-zinc-900/90 shadow-black/20"
                                  : node.status === "in-progress"
                                    ? "bg-zinc-900/90 border-white/10 ring-1 ring-white/5 shadow-lg shadow-black/40"
                                    : "bg-zinc-950/20 border-white/5 opacity-60 grayscale-30 hover:opacity-80 hover:grayscale-0"
                              }`}
                                style={{
                                  borderLeftColor: node.accent_color,
                                  borderLeftWidth: "3px",
                                }}
                              >
                                {node.status === "in-progress" && (
                                  <div
                                    className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.05]"
                                    style={{
                                      backgroundColor: node.accent_color,
                                    }}
                                  />
                                )}
                                {/* Card Top: Node Number, Icon, Title, and Type Badge */}
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm">
                                        {node.icon}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-bold text-gray-500">
                                            #{actualIndex + 1}
                                          </span>
                                          <h4 className="text-xs font-semibold text-gray-100 truncate">
                                            {node.title}
                                          </h4>
                                        </div>

                                        {/* Type tag */}
                                        <div className="mt-0.5 flex items-center gap-1.5">
                                          {node.type === "list" && (
                                            <span className="text-[9px] text-amber-400 font-medium">
                                              Sequential Tasks (
                                              {node.points?.length || 0})
                                            </span>
                                          )}
                                          {node.type === "roadmap" &&
                                            node.nodes.length > 0 && (
                                              <span className="text-[9px] text-purple-400 font-medium">
                                                Nested Roadmap (/)
                                              </span>
                                            )}
                                        </div>
                                      </div>
                                    </div>

                                    {node.type === "roadmap" &&
                                      node.nodes.length <= 0 && (
                                        <button
                                          type="button"
                                          // onClick={() =>
                                          //   onToggleTaskComplete?.(roadmap._id, point.id)
                                          // }
                                          aria-label={
                                            node.status === "completed"
                                              ? "Mark task incomplete"
                                              : "Mark task complete"
                                          }
                                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                                            node.status === "completed"
                                              ? "border-emerald-500 bg-emerald-500 text-black"
                                              : "border-gray-600 text-transparent hover:border-emerald-500 hover:text-emerald-400"
                                          }`}
                                        >
                                          <Check size={12} strokeWidth={3} />
                                        </button>
                                      )}
                                  </div>

                                  {/* Node description (if any) */}
                                  {node.description && (
                                    <p className="mt-2 text-[11px] text-gray-400 line-clamp-2">
                                      {node.description}
                                    </p>
                                  )}

                                  {/* Sequential Tasks vertical view */}
                                  {node.type === "list" && node.points && (
                                    <div className="mt-3 rounded-lg border border-white/5 bg-[#141414] p-2">
                                      <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                                        <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                                          <ListOrdered size={12} />
                                          Sequential Order
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => toggleExpand(node._id)}
                                          className="text-[10px] text-gray-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                                        >
                                          <span>
                                            {isExpanded
                                              ? "Collapse"
                                              : "View Steps"}
                                          </span>
                                          {isExpanded ? (
                                            <ChevronUp size={12} />
                                          ) : (
                                            <ChevronDown size={12} />
                                          )}
                                        </button>
                                      </div>

                                      {/* First task or full vertical list */}
                                      <div className="mt-2 space-y-1.5">
                                        {(isExpanded
                                          ? node.points
                                          : node.points.slice(0, 2)
                                        ).map((task, taskIdx) => (
                                          <div
                                            key={task.id}
                                            className="flex items-center justify-between gap-2 text-[11px]"
                                          >
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-bold text-amber-400">
                                                {taskIdx + 1}
                                              </span>
                                              <span
                                                className={`truncate ${
                                                  task.completed
                                                    ? "text-gray-500 line-through"
                                                    : "text-gray-200"
                                                }`}
                                              >
                                                {task.text}
                                              </span>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={() =>
                                                onToggleTaskComplete?.(
                                                  node._id,
                                                  task.id,
                                                )
                                              }
                                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition cursor-pointer ${
                                                task.completed
                                                  ? "border-emerald-500 bg-emerald-500 text-black"
                                                  : "border-gray-600 bg-black/40 hover:border-gray-400"
                                              }`}
                                            >
                                              {task.completed && (
                                                <Check
                                                  size={10}
                                                  strokeWidth={3}
                                                />
                                              )}
                                            </button>
                                          </div>
                                        ))}

                                        {!isExpanded &&
                                          node.points.length > 2 && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                toggleExpand(node._id)
                                              }
                                              className="text-[10px] text-gray-500 hover:text-gray-300 pt-0.5 cursor-pointer"
                                            >
                                              +{node.points.length - 2} more
                                              sequential steps...
                                            </button>
                                          )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Nested roadmap teaser button */}
                                  {node.type === "roadmap" &&
                                    node.nodes.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigate(
                                            `/roadmap/${splat ? `${splat}/` : ""}${node._id}`,
                                          );
                                          onOpenNestedRoadmap(node._id);
                                        }}
                                        className="mt-3 flex w-full items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1.5 text-[11px] text-purple-300 hover:bg-purple-500/20 transition cursor-pointer"
                                      >
                                        <span>Open Sub-Roadmap</span>
                                        <ChevronRight size={13} />
                                      </button>
                                    )}
                                </div>

                                {/* Card Bottom: Progress bar */}
                                <div className="mt-4 pt-2 border-t border-white/6">
                                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                                    <span>
                                      {isNodeDone ? (
                                        <span className="text-emerald-400 font-medium">
                                          ✓ Completed
                                        </span>
                                      ) : (
                                        <span>In Progress</span>
                                      )}
                                    </span>
                                    <span
                                      className="font-semibold"
                                      style={{ color: node.accent_color }}
                                    >
                                      {nodePercentage}%
                                    </span>
                                  </div>

                                  <div className="mt-1 h-0.75 overflow-hidden rounded-full bg-white/8">
                                    <div
                                      className="h-full rounded-full transition-all duration-300"
                                      style={{
                                        width: `${nodePercentage}%`,
                                        backgroundColor: node.accent_color,
                                      }}
                                    />
                                  </div>
                                </div>
                              </article>
                              <React.Fragment key={node._id}>
                                {nodeIndexInDisplay <
                                  displayNodes.length - 1 && (
                                  <div className="flex shrink-0 items-center justify-center">
                                    <ArrowRight
                                      size={18}
                                      strokeWidth={2}
                                      style={{
                                        color:
                                          node.status === "completed"
                                            ? node.accent_color
                                            : node.status === "in-progress"
                                              ? "#818cf8"
                                              : FADE_ARROW_COLOR,
                                      }}
                                    />
                                  </div>
                                )}
                              </React.Fragment>
                            </div>
                          );
                        })}
                      </div>

                      {/* Curved connector from the upper-right to lower-left */}
                      {!isLastRow && (
                        <div className="flex items-center justify-center w-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 800 60"
                            width="75%"
                            height="100%"
                          >
                            <path
                              d="M 780,10 L 780,20 Q 780,28 772,28 L 28,28 Q 20,28 20,36 L 20,46"
                              fill="none"
                              stroke={
                                rowNodes[rowNodes.length - 1].status ===
                                "completed"
                                  ? rowNodes[rowNodes.length - 1].accent_color
                                  : rowNodes[rowNodes.length - 1].status ===
                                      "in-progress"
                                    ? "#818cf8"
                                    : FADE_ARROW_COLOR
                              }
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M 16,42 L 20,46 L 24,42"
                              fill="none"
                              stroke={
                                rowNodes[rowNodes.length - 1].status ===
                                "completed"
                                  ? rowNodes[rowNodes.length - 1].accent_color
                                  : rowNodes[rowNodes.length - 1].status ===
                                      "in-progress"
                                    ? "#818cf8"
                                    : FADE_ARROW_COLOR
                              }
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 flex-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Task List
                </h3>
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                  Sequential
                </span>
              </div>

              <span className="text-[11px] text-gray-500">
                {roadmap.points?.length || 0} tasks
              </span>
            </div>

            {!roadmap.points || roadmap.points.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
                <ListOrdered size={30} className="mx-auto mb-2 text-gray-600" />
                <h4 className="text-sm font-semibold text-gray-300">
                  Your list is empty
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  Add tasks to get started.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
                {/* List header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-lg">
                      {roadmap.icon || "📋"}
                    </span>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-100">
                        {roadmap.title}
                      </h4>
                      {roadmap.description && (
                        <p className="mt-1 text-xs text-gray-400">
                          {roadmap.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {(() => {
                  const points = [...roadmap.points].sort(
                    (a, b) => a.order - b.order,
                  );
                  const completed = points.filter(
                    (point) => point.completed,
                  ).length;
                  const percentage = Math.round(
                    (completed / points.length) * 100,
                  );

                  return (
                    <>
                      <div className="mb-2 flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">
                          {completed} of {points.length} completed
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: roadmap.accent_color }}
                        >
                          {percentage}%
                        </span>
                      </div>

                      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: roadmap.accent_color,
                          }}
                        />
                      </div>

                      {/* Points */}
                      <div className="space-y-2">
                        {points.map((point, index) => (
                          <div
                            key={point.id}
                            className="flex items-center gap-3 rounded-lg border border-white/5 bg-black/20 px-3 py-3 transition hover:bg-white/3"
                          >
                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
                              style={{
                                backgroundColor: `${roadmap.accent_color}20`,
                                color: roadmap.accent_color,
                              }}
                            >
                              {index + 1}
                            </span>

                            <span
                              className={`min-w-0 flex-1 text-sm ${
                                point.completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-200"
                              }`}
                            >
                              {point.text}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                onToggleTaskComplete?.(roadmap._id, point.id)
                              }
                              aria-label={
                                point.completed
                                  ? "Mark task incomplete"
                                  : "Mark task complete"
                              }
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                                point.completed
                                  ? "border-emerald-500 bg-emerald-500 text-black"
                                  : "border-gray-600 text-transparent hover:border-emerald-500 hover:text-emerald-400"
                              }`}
                            >
                              <Check size={12} strokeWidth={3} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
