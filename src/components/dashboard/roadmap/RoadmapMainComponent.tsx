import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { RoadmapNode } from "./RoadmapNode";
import RoadmapsList from "./RoadmapsList";
import { useState } from "react";
import RoadmapPage from "./RoadmapPage";

const RoadmapMainComponent = () => {

    const [openRoadmap, setOpenRoadmap] = useState(false);

  const nodes = [
    {
      id: "1",
      type: "roadmap",
      position: { x: 400, y: 50 },
      data: {
        title: "DSA",
        description: "Master Data Structures and Algorithms",
        color: "#6366f1",
        parentId: null,
      },
    },

    {
      id: "2",
      type: "roadmap",
      position: { x: 150, y: 250 },
      data: {
        title: "Arrays",
        description: "Learn array patterns",
        color: "#22c55e",
        parentId: "1",
      },
    },

    {
      id: "3",
      type: "roadmap",
      position: { x: 650, y: 250 },
      data: {
        title: "Trees",
        description: "",
        color: "#f97316",
        parentId: "1",
      },
    },
  ];

  const edges = [
    {
      id: "1-2",
      source: "1",
      target: "2",
    },
    {
      id: "1-3",
      source: "1",
      target: "3",
    },
  ];

  const nodeTypes = {
    roadmap: RoadmapNode,
  };

  return (
    <>
    {openRoadmap ? <RoadmapPage setOpenRoadmap={setOpenRoadmap} /> : <RoadmapsList setOpenRoadmap={setOpenRoadmap} />}
      {/* <div className="w-full h-[calc(100vh-80px)]">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView />
      </div> */}
    </>
  );
};

export default RoadmapMainComponent;
