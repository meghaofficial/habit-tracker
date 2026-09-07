import type { Dispatch, SetStateAction } from "react";

const RoadmapPage = ({
  setOpenRoadmap,
}: {
  setOpenRoadmap: Dispatch<SetStateAction<boolean>>;
}) => {
  return <div onClick={() => setOpenRoadmap(false)}>Roadmap page</div>;
};

export default RoadmapPage;
