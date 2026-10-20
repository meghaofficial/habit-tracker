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

  console.log("roadmapSteps", params?.parentID);

  // useEffect(() => {
  //   if (roadmapSteps.length > 0) {
  //     if (roadmapSteps[0] === "create" && !params?.parentID) {
  //       setCurrentView("create");
  //     } else if (params?.parentID) {
  //       setCurrentView("view");
  //     }
  //   } else {
  //     setCurrentView("list");
  //   }
  // }, [params]);

  useEffect(() => {
    if (params.parentID === "create" || roadmapSteps[0] === "create") {
      setCurrentView("create");
    } else if (params.parentID) {
      setCurrentView("view");
    } else {
      setCurrentView("list");
    }
  }, [params.parentID, params["*"]]);

  return (
    <div className="w-full">
      {currentView === "list" && (
        <RoadmapList onAddNewRoadmap={() => setCurrentView("create")} />
      )}
      {currentView === "create" && <RoadmapCreation />}
      {currentView === "view" && <ViewRoadmapStructure />}
    </div>
  );
};

export default RoadmapMainComponent;
