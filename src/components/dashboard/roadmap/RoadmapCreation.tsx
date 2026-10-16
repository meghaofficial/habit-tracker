import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, GripVertical, Save, Sparkles } from "lucide-react";
import CreateRoadmap from "./CreateRoadmap";
import ViewRoadmap from "./ViewRoadmap";
import type { RoadmapData, RoadmapNode } from "./types";

export type RoadmapCreationProps = {
  onBack: () => void;
  onSaveRoadmap?: (roadmap: RoadmapData) => void;
};

// Initial default roadmap template with sample nodes to make testing immediately interactive
const initialRootRoadmap: RoadmapData = {
  id: "roadmap-" + Date.now(),
  title: "Modern Full-Stack Engineering",
  category: "Software Development",
  icon: "🚀",
  color: "#6366f1",
  description:
    "End-to-end pathway covering web architecture, APIs, distributed persistence, and cloud deployment.",
  nodes: [
    {
      id: "node-1",
      title: "Core Web Fundamentals",
      type: "single",
      icon: "🌱",
      color: "#10b981",
      description: "Master HTTP/HTTPS, browser rendering, DNS resolution, and security headers.",
      completed: true,
    },
    {
      id: "node-2",
      title: "State Management & React Architecture",
      type: "sequential",
      icon: "⚛️",
      color: "#38bdf8",
      tasks: [
        { id: "t1", title: "Step 1: Component Lifecycle & Hooks", completed: true },
        { id: "t2", title: "Step 2: Global Stores (Redux / Zustand)", completed: true },
        { id: "t3", title: "Step 3: Server State & TanStack Query", completed: false },
        { id: "t4", title: "Step 4: Performance Profiling & Memoization", completed: false },
      ],
    },
    {
      id: "node-3",
      title: "Backend Services & Microservices",
      type: "nested",
      icon: "🏛️",
      color: "#8b5cf6",
      nestedRoadmap: {
        id: "sub-1",
        title: "Distributed Microservices & APIs",
        category: "Backend Architecture",
        icon: "🏛️",
        color: "#8b5cf6",
        description: "Deep dive into gRPC, message queues, API gateways, and concurrency.",
        nodes: [
          {
            id: "sub-node-1",
            title: "REST & gRPC Contracts",
            type: "single",
            icon: "📜",
            color: "#8b5cf6",
            completed: true,
          },
          {
            id: "sub-node-2",
            title: "Event-Driven Queues (Kafka / RabbitMQ)",
            type: "sequential",
            icon: "⚡",
            color: "#ec4899",
            tasks: [
              { id: "sub-t1", title: "Step 1: Producer / Consumer Patterns", completed: true },
              { id: "sub-t2", title: "Step 2: Dead Letter Queues & Retries", completed: false },
            ],
          },
        ],
      },
    },
    {
      id: "node-4",
      title: "SQL & Distributed Database Tuning",
      type: "sequential",
      icon: "🗄️",
      color: "#f59e0b",
      tasks: [
        { id: "t4-1", title: "Step 1: Indexing & B-Trees", completed: true },
        { id: "t4-2", title: "Step 2: ACID Transactions & Locks", completed: false },
        { id: "t4-3", title: "Step 3: Sharding & Read Replicas", completed: false },
      ],
    },
    {
      id: "node-5",
      title: "Observability & Tracing",
      type: "single",
      icon: "📊",
      color: "#ec4899",
      description: "Prometheus, Grafana, OpenTelemetry, and structured logging in production.",
      completed: false,
    },
  ],
};

export default function RoadmapCreation({ onBack, onSaveRoadmap }: RoadmapCreationProps) {
  // Master roadmap tree state
  const [rootRoadmap, setRootRoadmap] = useState<RoadmapData>(initialRootRoadmap);

  // Navigation path for nested roadmaps (array of node IDs)
  // e.g. [] -> root, ["node-3"] -> nested under node-3
  const [navigationPath, setNavigationPath] = useState<string[]>([]);

  // Split-pane resizable width percentage for left panel (default 48%)
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(48);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Helper: update active roadmap in tree
  const handleUpdateActiveRoadmap = (updated: RoadmapData) => {
    if (navigationPath.length === 0) {
      setRootRoadmap(updated);
      return;
    }

    // Recursively update nested roadmap in tree
    const updateRecursive = (
      current: RoadmapData,
      pathIndex: number
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

  // Breadcrumb navigation
  const handleNavigateBreadcrumb = (index: number) => {
    if (index === 0) {
      setNavigationPath([]);
    } else {
      setNavigationPath(navigationPath.slice(0, index));
    }
  };

  // Open nested roadmap
  const handleOpenNestedRoadmap = (nodeId: string) => {
    setNavigationPath((prev) => [...prev, nodeId]);
  };

  // Interactive toggle: Single Node completion
  const handleToggleNodeComplete = (nodeId: string) => {
    const updatedNodes = activeRoadmap.nodes.map((n) => {
      if (n.id === nodeId) {
        return { ...n, completed: !n.completed };
      }
      return n;
    });
    handleUpdateActiveRoadmap({ ...activeRoadmap, nodes: updatedNodes });
  };

  // Interactive toggle: Sequential Task completion
  const handleToggleTaskComplete = (nodeId: string, taskId: string) => {
    const updatedNodes = activeRoadmap.nodes.map((n) => {
      if (n.id === nodeId && n.tasks) {
        const updatedTasks = n.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...n, tasks: updatedTasks };
      }
      return n;
    });
    handleUpdateActiveRoadmap({ ...activeRoadmap, nodes: updatedNodes });
  };

  // Resizable drag handler
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const newPercent = (relativeX / rect.width) * 100;
      // Clamp between 25% and 75% for smooth, practical view
      const clamped = Math.max(25, Math.min(75, newPercent));
      setLeftWidthPercent(clamped);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      document.body.style.userSelect = "";
    };

    if (isDragging) {
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return (
    <div className="w-full text-white min-h-[calc(100vh-120px)] flex flex-col">
      <div className="mx-auto max-w-[1700px] w-full px-2 py-3 sm:px-4 flex flex-col flex-1">
        {/* Top Header / Actions Bar */}
        <header className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to roadmaps"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#161616] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                  Roadmap Studio
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                  <Sparkles size={11} />
                  Dual-Panel
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Configure your roadmap on the left panel &bull; Drag divider to resize &bull; View horizontal zigzag path on the right
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-white/5 hover:text-white cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onSaveRoadmap?.(rootRoadmap)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 cursor-pointer"
            >
              <Save size={13} />
              <span>Save Roadmap</span>
            </button>
          </div>
        </header>

        {/* Resizable 2-Panel Container */}
        <div
          ref={containerRef}
          className="relative flex-1 flex flex-col lg:flex-row min-h-[640px] max-h-[82vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]"
        >
          {/* Left Panel: CreateRoadmap */}
          <div
            className="h-full overflow-hidden"
            style={{
              width: `${leftWidthPercent}%`,
            }}
          >
            <CreateRoadmap
              roadmap={activeRoadmap}
              onChangeRoadmap={handleUpdateActiveRoadmap}
              breadcrumbs={trail}
              onNavigateBreadcrumb={handleNavigateBreadcrumb}
              onOpenNestedRoadmap={handleOpenNestedRoadmap}
            />
          </div>

          {/* Smooth Middle Resizable Separator Bar */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="separator"
            aria-valuenow={Math.round(leftWidthPercent)}
            aria-valuemin={25}
            aria-valuemax={75}
            tabIndex={0}
            className={`group relative z-10 hidden lg:flex w-2.5 items-center justify-center cursor-col-resize transition-colors duration-150 select-none ${
              isDragging ? "bg-indigo-500/40" : "bg-white/[0.04] hover:bg-indigo-500/20"
            }`}
          >
            <div
              className={`flex h-10 w-3.5 items-center justify-center rounded-full border transition-all ${
                isDragging
                  ? "border-indigo-400 bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110"
                  : "border-white/15 bg-[#181818] text-gray-400 group-hover:border-indigo-400/60 group-hover:text-white"
              }`}
            >
              <GripVertical size={11} />
            </div>
          </div>

          {/* Right Panel: ViewRoadmap */}
          <div
            className="h-full flex-1 overflow-hidden"
            style={{
              width: `${100 - leftWidthPercent}%`,
            }}
          >
            <ViewRoadmap
              roadmap={activeRoadmap}
              breadcrumbs={trail}
              onNavigateBreadcrumb={handleNavigateBreadcrumb}
              onOpenNestedRoadmap={handleOpenNestedRoadmap}
              onToggleNodeComplete={handleToggleNodeComplete}
              onToggleTaskComplete={handleToggleTaskComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
