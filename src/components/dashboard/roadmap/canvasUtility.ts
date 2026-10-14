import {
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type Ref,
  type RefObject,
  type SetStateAction,
} from "react";

export type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
export interface NodeI {
  id: number;
  text: string;
  x: number;
  y: number;
  completed: boolean;
  width?: number;
  height?: number;
}

interface CanvasProps {
  nodes: NodeI[];
  setNodes: Dispatch<SetStateAction<NodeI[]>>;
}

export interface ResizeSession {
  pointerId: number;
  nodeId: number;
  handle: Handle;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
  minWidth: number;
  minHeight: number;
}

export interface MoveSession {
  pointerId: number;
  nodeId: number;
  startX: number;
  startY: number;
  startLeft: number;
  startTop: number;
}

export const handles: Handle[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

export type Direction = "top" | "bottom" | "left" | "right";

export interface EdgeI {
  id: string;
  from: number;
  to: number;
  direction: Direction;
}

export const handleClasses: Record<Handle, string> = {
  n: "left-1/2 top-0 h-1.5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
  s: "bottom-0 left-1/2 h-1.5 w-5 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
  e: "right-0 top-1/2 h-4 w-1.5 -translate-y-1/2 translate-x-1/2 cursor-e-resize",
  w: "left-0 top-1/2 h-4 w-1.5 -translate-y-1/2 -translate-x-1/2 cursor-w-resize",
  ne: "right-0 top-0 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 cursor-ne-resize rounded-full",
  nw: "left-0 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize rounded-full",
  se: "bottom-0 right-0 h-2.5 w-2.5 translate-x-1/2 translate-y-1/2 cursor-se-resize rounded-full",
  sw: "bottom-0 left-0 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 cursor-sw-resize rounded-full",
};
