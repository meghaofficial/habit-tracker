export type NodeType = "single" | "sequential" | "nested";

export type SequentialTask = {
  id: string;
  title: string;
  completed: boolean;
};

// export type RoadmapItem = {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   icon: string;
//   totalProblems: number;
//   completedProblems: number;
//   color: string;
//   badge?: string;
// };

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
  status: "completed" | "active" | "pending";
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

export type ListPoint = {
  id: string;
  text: string;
  order: number;
};

export interface RoadmapItem {
  _id: string;
  userID?: string;
  title: string;
  description?: string;
  icon?: string;
  total_nodes_count: number;
  completed_nodes_count: number;
  status: "completed" | "in-progress" | "pending";
  accent_color: string;
  category: string;
  type: "list" | "roadmap";
  points?: ListPoint[];
}
