import { useEffect, useState } from "react";
import RoadmapList from "./RoadmapList";
import RoadmapCreation from "./RoadmapCreation";
import { useParams } from "react-router-dom";
import ViewRoadmapStructure from "./ViewRoadmapStructure";
import type { RoadmapData } from "./types";

const RoadmapMainComponent = () => {
  const params = useParams();

  const [currentView, setCurrentView] = useState<"list" | "create" | "view">(
    "list",
  );
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapData>({
    id: "",
    title: "",
    icon: "",
    category: "",
    color: "",
    description: "",
    nodes: [],
  });

  const splat = params["*"];
  const roadmapSteps = splat ? splat.split("/") : [];

  useEffect(() => {
    if (roadmapSteps.length > 0) {
      setCurrentView("view");
    } else {
      setCurrentView("list");
    }
  }, [params]);

  return (
    <div className="w-full">
      {currentView === "list" && (
        <RoadmapList
          onAddNewRoadmap={() => setCurrentView("create")}
          setActiveRoadmap={setActiveRoadmap}
        />
      )}
      {currentView === "create" && (
        <RoadmapCreation onBack={() => setCurrentView("list")} />
      )}
      {currentView === "view" && <ViewRoadmapStructure />}
    </div>
  );
};

export default RoadmapMainComponent;
