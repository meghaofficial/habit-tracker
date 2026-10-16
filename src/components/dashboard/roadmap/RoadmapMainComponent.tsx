import { useState } from "react";
import RoadmapList from "./RoadmapList";
import RoadmapCreation from "./RoadmapCreation";

const RoadmapMainComponent = () => {
  const [currentView, setCurrentView] = useState<"list" | "create">("list");

  return (
    <div className="w-full">
      {currentView === "create" ? (
        <RoadmapCreation onBack={() => setCurrentView("list")} />
      ) : (
        <RoadmapList onAddNewRoadmap={() => setCurrentView("create")} />
      )}
    </div>
  );
};

export default RoadmapMainComponent;
