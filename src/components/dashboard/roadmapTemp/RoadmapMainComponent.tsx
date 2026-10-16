import RoadmapsList from "./RoadmapsList";
import { useState } from "react";
import RoadmapPage from "./RoadmapPage";
import RoadmapsPage from "./RoadmapsPage";
import { useNavigate } from "react-router-dom";

const RoadmapMainComponent = () => {
  const [openRoadmap, setOpenRoadmap] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* {openRoadmap ? (
        <RoadmapPage setOpenRoadmap={setOpenRoadmap} />
      ) : (
        <RoadmapsList setOpenRoadmap={setOpenRoadmap} />
      )} */}

      <RoadmapsPage />
      {/* <RoadmapsList /> */}
    </>
  );
};

export default RoadmapMainComponent;
