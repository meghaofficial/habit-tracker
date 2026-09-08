import RoadmapsList from "./RoadmapsList";
import { useState } from "react";
import RoadmapPage from "./RoadmapPage";

const RoadmapMainComponent = () => {
  const [openRoadmap, setOpenRoadmap] = useState(false);

  return (
    <>
      {openRoadmap ? (
        <RoadmapPage setOpenRoadmap={setOpenRoadmap} />
      ) : (
        <RoadmapsList setOpenRoadmap={setOpenRoadmap} />
      )}
    </>
  );
};

export default RoadmapMainComponent;
