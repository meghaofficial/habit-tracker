import React, { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  FolderGit2,
  ListOrdered,
  Sparkles,
  CornerDownLeft,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { RoadmapData, RoadmapNode } from "./types";

export type ViewRoadmapProps = {
  roadmap: RoadmapData;
  breadcrumbs: { id: string; title: string }[];
  onNavigateBreadcrumb: (index: number) => void;
  onOpenNestedRoadmap: (nodeId: string) => void;
  onToggleNodeComplete?: (nodeId: string) => void;
  onToggleTaskComplete?: (nodeId: string, taskId: string) => void;
};

export default function ViewRoadmap({
  roadmap,
  breadcrumbs,
  onNavigateBreadcrumb,
  onOpenNestedRoadmap,
  onToggleNodeComplete,
  onToggleTaskComplete,
}: ViewRoadmapProps) {
  // State for expanded sequential task checklists
  const [expandedNodeIds, setExpandedNodeIds] = useState<
    Record<string, boolean>
  >({});

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

    roadmap.nodes.forEach((node) => {
      if (node.type === "single") {
        totalPoints += 1;
        if (node.completed) completedPoints += 1;
      } else if (node.type === "sequential") {
        const tasks = node.tasks || [];
        totalPoints += tasks.length || 1;
        completedPoints += tasks.filter((t) => t.completed).length;
      } else if (node.type === "nested") {
        const subNodes = node.nestedRoadmap?.nodes || [];
        totalPoints += subNodes.length || 1;
        // count sub-completed
        const doneSub = subNodes.filter((sn) =>
          sn.type === "single"
            ? sn.completed
            : sn.tasks?.every((t) => t.completed),
        ).length;
        completedPoints += doneSub;
      }
    });

    const percentage =
      totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

    return {
      completedPoints,
      totalPoints,
      percentage,
    };
  }, [roadmap.nodes]);

  // Organize nodes into rows for horizontal zigzag (serpentine) layout
  const NODES_PER_ROW = 3;
  const rows = useMemo(() => {
    const result: RoadmapNode[][] = [];
    for (let i = 0; i < roadmap.nodes.length; i += NODES_PER_ROW) {
      result.push(roadmap.nodes.slice(i, i + NODES_PER_ROW));
    }
    return result;
  }, [roadmap.nodes]);

  const fullDisplayTitle = breadcrumbs
    .map((b) => b.title || "Untitled")
    .join(" / ");

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-4 sm:p-6 shadow-sm">
      {/* Breadcrumb Bar */}
      <div className="flex flex-wrap items-center gap-1.5 pb-3 text-xs text-gray-400 border-b border-white/[0.08]">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.id + idx}>
              <button
                type="button"
                onClick={() => onNavigateBreadcrumb(idx)}
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

      {/* Header Preview Info */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl shadow-lg border border-white/10"
            style={{ backgroundColor: `${roadmap.color}25` }}
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

        {/* Overall progress indicator */}
        <div className="rounded-xl border border-white/[0.08] bg-[#171717] px-3.5 py-2.5 shrink-0 min-w-[160px]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400 font-medium">Progress</span>
            <span className="font-bold text-emerald-400">
              {stats.percentage}%
            </span>
          </div>

          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>

          <div className="mt-1 text-right text-[9px] text-gray-500">
            {stats.completedPoints}/{stats.totalPoints} milestones completed
          </div>
        </div>
      </div>

      {/* Zigzag Serpentine Path View */}
      <div className="mt-6 flex-1">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Interactive Roadmap Path
            </h3>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
              Horizontal Zigzag
            </span>
          </div>

          <span className="text-[11px] text-gray-500">
            {roadmap.nodes.length} nodes in sequence
          </span>
        </div>

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
          <div className="space-y-6 pb-6">
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
                  {/* Row direction indicator */}
                  <div className="mb-1.5 flex items-center justify-between text-[10px] text-gray-500 px-1">
                    <span className="font-medium">
                      Row {rowIndex + 1} (
                      {isEvenRow ? "Left → Right" : "Right → Left"})
                    </span>
                    <span className="text-gray-600">
                      Nodes {rowIndex * NODES_PER_ROW + 1} to{" "}
                      {rowIndex * NODES_PER_ROW + rowNodes.length}
                    </span>
                  </div>

                  {/* Nodes in this row */}
                  <div
                    className={`grid gap-3 ${
                      rowNodes.length === 1
                        ? "grid-cols-1 sm:grid-cols-3"
                        : rowNodes.length === 2
                          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
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

                      if (node.type === "single") {
                        nodePercentage = node.completed ? 100 : 0;
                        isNodeDone = !!node.completed;
                      } else if (node.type === "sequential") {
                        const total = node.tasks?.length || 0;
                        const done =
                          node.tasks?.filter((t) => t.completed).length || 0;
                        nodePercentage =
                          total > 0 ? Math.round((done / total) * 100) : 0;
                        isNodeDone = total > 0 && done === total;
                      } else if (node.type === "nested") {
                        const subNodes = node.nestedRoadmap?.nodes || [];
                        const done = subNodes.filter((sn) =>
                          sn.type === "single"
                            ? sn.completed
                            : sn.tasks?.every((t) => t.completed),
                        ).length;
                        nodePercentage =
                          subNodes.length > 0
                            ? Math.round((done / subNodes.length) * 100)
                            : 0;
                        isNodeDone =
                          subNodes.length > 0 && done === subNodes.length;
                      }

                      const isExpanded = !!expandedNodeIds[node.id];

                      return (
                        <article
                          key={node.id}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.12] bg-[#191919] p-3 transition duration-200 hover:border-white/25 hover:bg-[#1d1d1d] shadow-sm"
                          style={{
                            borderLeftColor: node.color,
                            borderLeftWidth: "3px",
                          }}
                        >
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
                                    {node.type === "single" && (
                                      <span className="text-[9px] text-blue-400 font-medium">
                                        Single Milestone
                                      </span>
                                    )}
                                    {node.type === "sequential" && (
                                      <span className="text-[9px] text-amber-400 font-medium">
                                        Sequential Tasks (
                                        {node.tasks?.length || 0})
                                      </span>
                                    )}
                                    {node.type === "nested" && (
                                      <span className="text-[9px] text-purple-400 font-medium">
                                        Nested Roadmap (/)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Interactive check or action button */}
                              {node.type === "single" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onToggleNodeComplete?.(node.id)
                                  }
                                  title={
                                    node.completed
                                      ? "Mark incomplete"
                                      : "Mark completed"
                                  }
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition cursor-pointer ${
                                    node.completed
                                      ? "border-emerald-500 bg-emerald-500 text-black shadow-sm"
                                      : "border-white/20 bg-black/40 text-transparent hover:border-white/40"
                                  }`}
                                >
                                  <Check size={14} strokeWidth={3} />
                                </button>
                              )}

                              {node.type === "nested" && (
                                <button
                                  type="button"
                                  onClick={() => onOpenNestedRoadmap(node.id)}
                                  title="Enter Nested Roadmap"
                                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 transition cursor-pointer"
                                >
                                  <FolderGit2 size={13} />
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
                            {node.type === "sequential" && node.tasks && (
                              <div className="mt-3 rounded-lg border border-white/5 bg-[#141414] p-2">
                                <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                                  <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                                    <ListOrdered size={12} />
                                    Sequential Order
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand(node.id)}
                                    className="text-[10px] text-gray-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <span>
                                      {isExpanded ? "Collapse" : "View Steps"}
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
                                    ? node.tasks
                                    : node.tasks.slice(0, 2)
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
                                          {task.title}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          onToggleTaskComplete?.(
                                            node.id,
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
                                          <Check size={10} strokeWidth={3} />
                                        )}
                                      </button>
                                    </div>
                                  ))}

                                  {!isExpanded && node.tasks.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleExpand(node.id)}
                                      className="text-[10px] text-gray-500 hover:text-gray-300 pt-0.5 cursor-pointer"
                                    >
                                      +{node.tasks.length - 2} more sequential
                                      steps...
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Nested roadmap teaser button */}
                            {node.type === "nested" && (
                              <button
                                type="button"
                                onClick={() => onOpenNestedRoadmap(node.id)}
                                className="mt-3 flex w-full items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1.5 text-[11px] text-purple-300 hover:bg-purple-500/20 transition cursor-pointer"
                              >
                                <span>Open Sub-Roadmap</span>
                                <ChevronRight size={13} />
                              </button>
                            )}
                          </div>

                          {/* Card Bottom: Progress bar */}
                          <div className="mt-4 pt-2 border-t border-white/[0.06]">
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
                                style={{ color: node.color }}
                              >
                                {nodePercentage}%
                              </span>
                            </div>

                            <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${nodePercentage}%`,
                                  backgroundColor: node.color,
                                }}
                              />
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* Horizontal Connector and Vertical Turn to Next Row */}
                  {!isLastRow && (
                    <div className="my-3 flex items-center justify-between px-2">
                      {isEvenRow ? (
                        <>
                          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#161616] px-3 py-1 rounded-full border border-white/10 shadow-sm">
                            <span>Turn Down &amp; Reverse (Right to Left)</span>
                            <CornerDownLeft
                              size={14}
                              className="text-indigo-400"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#161616] px-3 py-1 rounded-full border border-white/10 shadow-sm">
                            <CornerDownRight
                              size={14}
                              className="text-indigo-400"
                            />
                            <span>Turn Down (Left to Right)</span>
                          </div>
                          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
