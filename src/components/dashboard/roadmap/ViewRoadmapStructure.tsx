import React, { useCallback, useState } from "react";
import ViewRoadmap from "./ViewRoadmap";
import type { RoadmapData } from "./types";
import { initialRootRoadmap } from "./testData";
import { ArrowLeft } from "lucide-react";

const ViewRoadmapStructure = ({ onBack }: { onBack: () => void }) => {
  const [rootRoadmap, setRootRoadmap] =
    useState<RoadmapData>(initialRootRoadmap);
  // Navigation path for nested roadmaps (array of node IDs)
  // e.g. [] -> root, ["node-3"] -> nested under node-3
  const [navigationPath, setNavigationPath] = useState<string[]>([]);

  // Helper: locate active roadmap data based on navigationPath
  const getActiveRoadmapAndTrail = useCallback((): {
    activeRoadmap: RoadmapData;
    trail: { id: string; title: string }[];
  } => {
    let current = rootRoadmap;
    const trail = [{ id: rootRoadmap.id, title: rootRoadmap.title }];

    for (const nodeId of navigationPath) {
      const foundNode = current.nodes.find((n) => n.id === nodeId);
      if (foundNode && foundNode.nestedRoadmap) {
        current = foundNode.nestedRoadmap;
        trail.push({ id: current.id, title: current.title });
      } else {
        break;
      }
    }

    return { activeRoadmap: current, trail };
  }, [rootRoadmap, navigationPath]);

  const { activeRoadmap, trail } = getActiveRoadmapAndTrail();

  const handleUpdateActiveRoadmap = (updated: RoadmapData) => {
    if (navigationPath.length === 0) {
      setRootRoadmap(updated);
      return;
    }

    // Recursively update nested roadmap in tree
    const updateRecursive = (
      current: RoadmapData,
      pathIndex: number,
    ): RoadmapData => {
      const targetNodeId = navigationPath[pathIndex];
      const newNodes = current.nodes.map((node) => {
        if (node.id !== targetNodeId) return node;

        if (pathIndex === navigationPath.length - 1) {
          // Reached target
          return {
            ...node,
            title: updated.title,
            icon: updated.icon,
            color: updated.color,
            nestedRoadmap: updated,
          };
        } else if (node.nestedRoadmap) {
          return {
            ...node,
            nestedRoadmap: updateRecursive(node.nestedRoadmap, pathIndex + 1),
          };
        }
        return node;
      });

      return { ...current, nodes: newNodes };
    };

    setRootRoadmap((prev) => updateRecursive(prev, 0));
  };

  const handleNavigateBreadcrumb = (index: number) => {
    if (index === 0) {
      setNavigationPath([]);
    } else {
      setNavigationPath(navigationPath.slice(0, index));
    }
  };

  const handleOpenNestedRoadmap = (nodeId: string) => {
    setNavigationPath((prev) => [...prev, nodeId]);
  };

  const handleToggleNodeComplete = (nodeId: string) => {
    const updatedNodes = activeRoadmap.nodes.map((n) => {
      if (n.id === nodeId) {
        return { ...n, completed: !n.completed };
      }
      return n;
    });
    handleUpdateActiveRoadmap({ ...activeRoadmap, nodes: updatedNodes });
  };

  const handleToggleTaskComplete = (nodeId: string, taskId: string) => {
    const updatedNodes = activeRoadmap.nodes.map((n) => {
      if (n.id === nodeId && n.tasks) {
        const updatedTasks = n.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t,
        );
        return { ...n, tasks: updatedTasks };
      }
      return n;
    });
    handleUpdateActiveRoadmap({ ...activeRoadmap, nodes: updatedNodes });
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-4 sm:p-6 shadow-sm mt-4">
      {/* Breadcrumb Bar */}
      <div className="flex flex-wrap items-center gap-1.5 pb-3 text-xs text-gray-400 border-b border-white/8">
        <button
          type="button"
          onClick={onBack}
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
                onClick={() => handleNavigateBreadcrumb(idx)}
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
      <ViewRoadmap
        roadmap={activeRoadmap}
        onOpenNestedRoadmap={handleOpenNestedRoadmap}
        onToggleNodeComplete={handleToggleNodeComplete}
        onToggleTaskComplete={handleToggleTaskComplete}
      />
    </div>
  );
};

export default ViewRoadmapStructure;
