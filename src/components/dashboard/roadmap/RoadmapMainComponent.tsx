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

  // useEffect(() => {
  //   if (
  //     params.parentID === "create" ||
  //     roadmapSteps[0] === "create" ||
  //     params.roadmapID
  //   ) {
  //     setCurrentView("create");
  //   } else if (params.parentID) {
  //     setCurrentView("view");
  //   } else {
  //     setCurrentView("list");
  //   }
  // }, [params.parentID, params["*"], params.roadmapID]);

  useEffect(() => {
    const pathSegments = params["*"]?.split("/").filter(Boolean) || [];
    const parentID = pathSegments[pathSegments.length - 1];

    if (
      parentID === "create" ||
      pathSegments[0] === "create" ||
      params.roadmapID
    ) {
      setCurrentView("create");
    } else if (parentID) {
      setCurrentView("view");
    } else {
      setCurrentView("list");
    }
  }, [params["*"], params.roadmapID]);

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
