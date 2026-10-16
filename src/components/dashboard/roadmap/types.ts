export type NodeType = "single" | "sequential" | "nested";

export type SequentialTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type RoadmapNode = {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  type: NodeType;
  // Single node
  completed?: boolean;
  // Sequential task node
  tasks?: SequentialTask[];
  // Nested roadmap
  nestedRoadmap?: RoadmapData;
};

export type RoadmapData = {
  id: string;
  title: string;
  category?: string;
  icon: string;
  color: string;
  description?: string;
  nodes: RoadmapNode[];
};
