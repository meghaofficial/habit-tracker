import { useEffect, useState } from "react";
import RoadmapList from "./RoadmapList";
import RoadmapCreation from "./RoadmapCreation";
import { useParams } from "react-router-dom";
import ViewRoadmapStructure from "./ViewRoadmapStructure";

const RoadmapMainComponent = () => {
  const params = useParams();

  const [currentView, setCurrentView] = useState<"list" | "create" | "view">(
    "list",
  );

  useEffect(() => {
    if (params.name) {
      setCurrentView("view");
    }
  }, [params]);

  return (
    <div className="w-full">
      {currentView === "list" && (
        <RoadmapList onAddNewRoadmap={() => setCurrentView("create")} />
      )}
      {currentView === "create" && (
        <RoadmapCreation onBack={() => setCurrentView("list")} />
      )}
      {currentView === "view" && (
        <ViewRoadmapStructure onBack={() => setCurrentView("list")} />
      )}
    </div>
  );
};

export default RoadmapMainComponent;
