import React, { useCallback, useEffect, useState } from "react";
import ViewRoadmap from "./ViewRoadmap";
import { type RoadmapItem, type RoadmapData } from "./types";
import { initialRootRoadmap } from "./testData";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { roadmapApi } from "../../../api/roadmap.api";

const ViewRoadmapStructure = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [rootRoadmap, setRootRoadmap] =
    useState<RoadmapData>(initialRootRoadmap);
  const [navigationPath, setNavigationPath] = useState<string[]>([]);
  const splat = params["*"];
  const roadmapSteps = splat ? splat.split("/") : [];

  const [loading, setLoading] = useState(false);

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

  // const { activeRoadmap, trail } = getActiveRoadmapAndTrail();
  const { trail } = getActiveRoadmapAndTrail();

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

  // const handleNavigateBreadcrumb = (title: string) => {
  //   const targetIndex = roadmapSteps.indexOf(title);
  //   if (targetIndex === -1) {
  //     setNavigationPath([]);
  //     navigate("/roadmap");
  //     return;
  //   }
  //   const newPathSegments = roadmapSteps.slice(0, targetIndex + 1);
  //   setNavigationPath(newPathSegments);
  //   navigate(`/roadmap/${newPathSegments.join("/")}`);
  // };

  const handleNavigateBreadcrumb = (id: string) => {
    const targetIndex = roadmapTrail.findIndex((crumb) => crumb._id === id);

    if (targetIndex === -1) {
      setNavigationPath([]);
      navigate("/roadmap");
      return;
    }

    const newPathSegments = roadmapTrail
      .slice(0, targetIndex + 1)
      .map((crumb) => crumb._id);

    setNavigationPath(newPathSegments);

    navigate(`/roadmap/${newPathSegments.join("/")}`);
  };

  const handleOpenNestedRoadmap = (nodeId: string) => {
    setNavigationPath((prev) => [...prev, nodeId]);
  };

  const handleToggleNodeComplete = (nodeId: string) => {
    // const updatedNodes = activeRoadmap.nodes.map((n) => {
    //   if (n.id === nodeId) {
    //     return { ...n, completed: !n.completed };
    //   }
    //   return n;
    // });
    // handleUpdateActiveRoadmap({ ...activeRoadmap, nodes: updatedNodes });
  };

  const handleToggleTaskComplete = (nodeId: string, taskId: string) => {
    // const updatedNodes = activeRoadmap.nodes.map((n) => {
    //   if (n.id === nodeId && n.tasks) {
    //     const updatedTasks = n.tasks.map((t) =>
    //       t.id === taskId ? { ...t, completed: !t.completed } : t,
    //     );
    //     return { ...n, tasks: updatedTasks };
    //   }
    //   return n;
    // });
    // handleUpdateActiveRoadmap({ ...activeRoadmap, nodes: updatedNodes });
  };

  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapItem>({
    _id: "",
    title: "",
    description: "",
    icon: "",
    total_nodes_count: 0,
    completed_nodes_count: 0,
    status: "pending",
    accent_color: "",
    category: "",
    nodes: [],
    type: "roadmap",
    parent_id: null,
    points: [],
  });

  useEffect(() => {
    const fetchRoadmap = async () => {
      const pathSegments = params["*"]?.split("/").filter(Boolean) || [];
      const parentID = pathSegments[pathSegments.length - 1];

      if (!parentID || parentID === "create") return;

      try {
        setLoading(true);

        const response = await roadmapApi.getRoadmapByID(parentID);

        setActiveRoadmap(response?.data);
      } catch (error) {
        console.error("Failed to fetch roadmap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [params["*"]]);

  // Trail
  const [roadmapTrail, setRoadmapTrail] = useState<
    {
      _id: string;
      title: string;
      accent_color: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchTrail = async () => {
      const ids = params["*"]?.split("/").filter(Boolean) || [];
      const validIDs = ids.filter((id) => id !== "create");

      if (validIDs.length === 0) {
        setRoadmapTrail([]);
        return;
      }

      try {
        const response = await roadmapApi.getRoadmapTrail(validIDs);
        setRoadmapTrail(response.data);
      } catch (error) {
        console.error("Failed to fetch roadmap trail:", error);
      }
    };

    fetchTrail();
  }, [params["*"]]);

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] shadow-sm my-4">
      {/* Breadcrumb Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 text-xs text-gray-400 border-b border-white/8">
        <button
          type="button"
          onClick={() => {
            if (roadmapTrail.length <= 1) {
              setNavigationPath([]);
              navigate("/roadmap");
              return;
            }

            const parentPath = roadmapTrail
              .slice(0, -1)
              .map((crumb) => crumb._id);

            setNavigationPath(parentPath);
            navigate(`/roadmap/${parentPath.join("/")}`);
          }}
          aria-label="Back to roadmaps"
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#161616] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
        {roadmapTrail.map((crumb, idx) => {
          const isLast = idx === roadmapTrail.length - 1;

          return (
            <React.Fragment key={crumb._id + idx}>
              <button
                type="button"
                onClick={() => handleNavigateBreadcrumb(crumb._id)}
                style={{ color: crumb.accent_color || "#34d399" }}
                className={`font-medium transition hover:opacity-80 ${
                  isLast ? "font-semibold" : "hover:underline"
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
        {loading ? (
          <div>
            <SkeletonLoader />
          </div>
        ) : (
          <ViewRoadmap
            roadmap={activeRoadmap}
            onOpenNestedRoadmap={handleOpenNestedRoadmap}
            onToggleNodeComplete={handleToggleNodeComplete}
            onToggleTaskComplete={handleToggleTaskComplete}
          />
        )}
      </div>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <div>
      {/* Header Preview Info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-11 w-11 animate-pulse bg-white/5 shrink-0 items-center justify-center rounded-2xl text-xl shadow-lg"></div>

          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold h-10 w-30 rounded-xl animate-pulse bg-white/5 text-white tracking-tight sm:text-lg"></h1>

            <p className="mt-1 text-xs animate-pulse bg-white/10 text-gray-400 line-clamp-2"></p>
          </div>
        </div>

        {/* Overall progress indicator */}
        <div className="rounded-xl h-15 w-35 animate-pulse bg-white/5 px-3.5 py-2.5 shrink-0 min-w-[160px]40"></div>
      </div>

      <div className="animate-pulse bg-white/5 mt-6 rounded-2xl h-60"></div>
    </div>
  );
};

export default ViewRoadmapStructure;
