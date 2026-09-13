import { useState, type Dispatch, type SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiMove,
  FiChevronDown,
  FiChevronRight,
  FiTrash2,
} from "react-icons/fi";
import { FaHandPaper } from "react-icons/fa";
import type {
  NodeI,
  DraggingI,
  EdgeI,
  PanI,
  EdgeType,
  EdgeCoordinatesI,
} from "../../../types";

const NODE_WIDTH = 140;
const NODE_HEIGHT = 80;

const Canvas = ({
  nodes,
  setNodes,
}: {
  nodes: NodeI[];
  setNodes: Dispatch<SetStateAction<NodeI[]>>;
}) => {
  const [edges, setEdges] = useState<EdgeI[]>([]);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<number>>(new Set());
  const [dragging, setDragging] = useState<DraggingI | null>(null);
  const [isPanningEnabled, setIsPanningEnabled] = useState(false);
  const [pan, setPan] = useState({
    x: 0,
    y: 0,
  });
  const [panStart, setPanStart] = useState<PanI | null>(null);

  console.log("nodes", nodes);
  console.log("edges", edges)

  const createChildNode = (parent: NodeI) => {
    if (isPanningEnabled) {
      return;
    }

    const nodeId = Date.now();

    const newNode: NodeI = {
      id: nodeId,
      text: "Child Node",
      x: parent.x + NODE_WIDTH + 100,
      y: parent.y,
      completed: false,
    };

    const newEdge: EdgeI = {
      id: nodeId + 1,
      source: parent.id,
      target: nodeId,
      type: "child",
    };

    setNodes((prev) => [...prev, newNode]);
    setEdges((prev) => [...prev, newEdge]);

    // Automatically expand parent
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      next.delete(parent.id);
      return next;
    });
  };

  const createLinkedNode = (source: NodeI) => {
    if (isPanningEnabled) {
      return;
    }

    const nodeId = Date.now();

    const newNode: NodeI = {
      id: nodeId,
      text: "New Node",
      x: source.x,
      y: source.y + NODE_HEIGHT + 50,
      completed: false,
    };

    const newEdge: EdgeI = {
      id: nodeId + 1,
      source: source.id,
      target: nodeId,
      type: "linked",
    };

    setNodes((prev) => [...prev, newNode]);
    setEdges((prev) => [...prev, newEdge]);

    // Automatically expand source
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      next.delete(source.id);
      return next;
    });
  };

  const updateText = (id: number, text: string) => {
    if (isPanningEnabled) {
      return;
    }

    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              text,
            }
          : node,
      ),
    );
  };

  const getChildren = (nodeId: number): number[] => {
    return edges
      .filter((edge) => edge.type === "child" && edge.source === nodeId)
      .map((edge) => edge.target);
  };

  const toggleNodeCompletion = (nodeId: number) => {
    if (isPanningEnabled) {
      return;
    }

    setNodes((prevNodes) => {
      // First toggle the clicked leaf node
      const updatedNodes = prevNodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              completed: !node.completed,
            }
          : node,
      );

      const nodeMap = new Map(updatedNodes.map((node) => [node.id, node]));

      // Calculate completion recursively
      const getCompletion = (
        currentId: number,
        visited = new Set<number>(),
      ): boolean => {
        if (visited.has(currentId)) {
          return false;
        }

        visited.add(currentId);

        const children = getChildren(currentId);

        // Leaf node → use its own completion state
        if (children.length === 0) {
          return nodeMap.get(currentId)?.completed ?? false;
        }

        // Parent → completed only when ALL children are completed
        return children.every((childId) =>
          getCompletion(childId, new Set(visited)),
        );
      };

      // Recalculate completion for every node
      return updatedNodes.map((node) => ({
        ...node,
        completed: getCompletion(node.id),
      }));
    });
  };

  const getChildDescendants = (nodeId: number): number[] => {
    const children = getChildren(nodeId);

    let descendants = [...children];

    children.forEach((childId) => {
      descendants = [...descendants, ...getChildDescendants(childId)];
    });

    return descendants;
  };

  // const getAllDescendants = (nodeId: number): number[] => {
  //   const descendants: number[] = [];
  //   const visited = new Set<number>();

  //   const traverse = (currentId: number) => {
  //     edges.forEach((edge) => {
  //       if (edge.source === currentId && !visited.has(edge.target)) {
  //         visited.add(edge.target);
  //         descendants.push(edge.target);

  //         traverse(edge.target);
  //       }
  //     });
  //   };

  //   traverse(nodeId);

  //   return descendants;
  // };

  const getDeleteDescendants = (nodeId: number): number[] => {
    const result: number[] = [];
    const visited = new Set<number>();

    // Start ONLY with child nodes
    const childNodes = getChildren(nodeId);

    const traverse = (currentId: number) => {
      edges.forEach((edge) => {
        if (edge.source === currentId && !visited.has(edge.target)) {
          visited.add(edge.target);
          result.push(edge.target);

          // Once we're inside the child branch,
          // follow both child and linked edges.
          traverse(edge.target);
        }
      });
    };

    childNodes.forEach((childId) => {
      if (!visited.has(childId)) {
        visited.add(childId);
        result.push(childId);

        traverse(childId);
      }
    });

    return result;
  };

  const deleteNode = (nodeId: number) => {
    if (isPanningEnabled) {
      return;
    }

    const descendants = getDeleteDescendants(nodeId);
    const nodesToDelete = new Set<number>([nodeId, ...descendants]);

    // Remove nodes
    setNodes((prev) => prev.filter((node) => !nodesToDelete.has(node.id)));

    // Remove related edges
    setEdges((prev) =>
      prev.filter(
        (edge) =>
          !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target),
      ),
    );

    // Remove collapsed state
    setCollapsedNodes((prev) => {
      const next = new Set(prev);

      nodesToDelete.forEach((id) => {
        next.delete(id);
      });

      return next;
    });
  };

  const toggleCollapse = (nodeId: number) => {
    if (isPanningEnabled) {
      return;
    }

    setCollapsedNodes((prev) => {
      const next = new Set(prev);

      if (next.has(nodeId)) {
        // Expand this node
        next.delete(nodeId);
      } else {
        // Collapse this node
        next.add(nodeId);
      }

      return next;
    });
  };

  const getBranchDescendants = (nodeId: number): number[] => {
    const result: number[] = [];
    const visited = new Set<number>();

    const traverse = (currentId: number) => {
      edges.forEach((edge) => {
        if (edge.source === currentId && !visited.has(edge.target)) {
          visited.add(edge.target);
          result.push(edge.target);

          traverse(edge.target);
        }
      });
    };

    traverse(nodeId);

    return result;
  };

  const isNodeHidden = (nodeId: number): boolean => {
    for (const collapsedId of collapsedNodes) {
      const children = getChildren(collapsedId);

      for (const childId of children) {
        if (nodeId === childId) {
          return true;
        }

        const descendants = getBranchDescendants(childId);

        if (descendants.includes(nodeId)) {
          return true;
        }
      }
    }

    return false;
  };

  const handleDragStart = (
    e: React.PointerEvent<HTMLButtonElement>,
    node: NodeI,
  ) => {
    if (isPanningEnabled) {
      return;
    }

    e.stopPropagation();

    setDragging({
      id: node.id,
      offsetX: e.clientX - node.x,
      offsetY: e.clientY - node.y,
    });

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanningEnabled) {
      return;
    }

    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    setPanStart({
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
    });

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanningEnabled && panStart) {
      const deltaX = e.clientX - panStart.startX;

      const deltaY = e.clientY - panStart.startY;

      setPan({
        x: panStart.initialPanX + deltaX,
        y: panStart.initialPanY + deltaY,
      });

      return;
    }

    if (!isPanningEnabled && dragging) {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === dragging.id
            ? {
                ...node,
                x: e.clientX - dragging.offsetX,
                y: e.clientY - dragging.offsetY,
              }
            : node,
        ),
      );
    }
  };

  const handlePointerUp = () => {
    setDragging(null);
    setPanStart(null);
  };

  const togglePanning = () => {
    setIsPanningEnabled((prev) => !prev);
    // Stop any active node drag
    setDragging(null);
    // Stop any active pan
    setPanStart(null);
  };

  const getEdgeCoordinates = (
    source: NodeI,
    target: NodeI,
    type: EdgeType,
  ): EdgeCoordinatesI => {
    if (type === "child") {
      return {
        startX: source.x + NODE_WIDTH,
        startY: source.y + NODE_HEIGHT / 2,
        endX: target.x,
        endY: target.y + NODE_HEIGHT / 2,
      };
    }

    return {
      startX: source.x + NODE_WIDTH / 2,
      startY: source.y + NODE_HEIGHT,
      endX: target.x + NODE_WIDTH / 2,
      endY: target.y,
    };
  };

  const createPath = (coordinates: EdgeCoordinatesI, type: EdgeType) => {
    const { startX, startY, endX, endY } = coordinates;

    if (type === "child") {
      const controlOffset = Math.max(80, Math.abs(endX - startX) / 2);

      return `
        M ${startX} ${startY}

        C
        ${startX + controlOffset}
        ${startY},

        ${endX - controlOffset}
        ${endY},

        ${endX}
        ${endY}
      `;
    }

    const verticalOffset = Math.max(60, Math.abs(endY - startY) / 2);

    return `
      M ${startX} ${startY}

      C
      ${startX}
      ${startY + verticalOffset},

      ${endX}
      ${endY - verticalOffset},

      ${endX}
      ${endY}
    `;
  };

  return (
    <div
      className={` relative w-full h-screen overflow-hidden select-none ${isPanningEnabled ? "cursor-grab" : ""} ${panStart ? "cursor-grabbing" : ""} `}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* ================================================= */}
      {/* PAN TOGGLE                                        */}
      {/* ================================================= */}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          togglePanning();
        }}
        className={` absolute top-4 ${nodes.length > 0 ? "left-16" : "left-44"} z-50 w-9 h-9 rounded-lg flex items-center justify-center border shadow-lg transition-colors ${isPanningEnabled ? `text-indigo-400 border-indigo-400/20 bg-indigo-500/10` : ` bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white `} `}
        title={isPanningEnabled ? "Disable panning" : "Enable panning"}
      >
        <FaHandPaper size={15} />
      </button>

      {/* ================================================= */}
      {/* CANVAS CONTENT                                    */}
      {/* ================================================= */}

      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        {/* ================================================= */}
        {/* EDGES                                             */}
        {/* ================================================= */}

        <svg className=" absolute left-0 top-0 w-full h-full pointer-events-none overflow-visible ">
          <AnimatePresence>
            {edges.map((edge) => {
              const source = nodes.find((node) => node.id === edge.source);
              const target = nodes.find((node) => node.id === edge.target);

              if (!source || !target) {
                return null;
              }

              if (isNodeHidden(source.id) || isNodeHidden(target.id)) {
                return null;
              }

              const coordinates = getEdgeCoordinates(source, target, edge.type);
              const path = createPath(coordinates, edge.type);
              const isChildEdge = edge.type === "child";

              return (
                <motion.path
                  key={edge.id}
                  d={path}
                  fill="none"
                  stroke="white"
                  strokeWidth={isChildEdge ? 2 : 1.5}
                  strokeOpacity={isChildEdge ? 0.65 : 0.3}
                  initial={{
                    pathLength: 0,
                    opacity: 0,
                  }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* ================================================= */}
        {/* NODES                                             */}
        {/* ================================================= */}

        <AnimatePresence>
          {nodes.map((node) => {
            if (isNodeHidden(node.id)) {
              return null;
            }

            const children = getChildren(node.id);
            const hasChildren = children.length > 0;
            const isCollapsed = collapsedNodes.has(node.id);

            return (
              <motion.div
                key={node.id}
                className="absolute"
                style={{
                  left: node.x,
                  top: node.y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                {/* ======================================= */}
                {/* NODE                                     */}
                {/* ======================================= */}

                <motion.div
                  className={`group relative w-full h-full rounded-xl border shadow-xl transition-colors ${
                    node.completed
                      ? "border-emerald-400/40 bg-emerald-500/15"
                      : "border-neutral-700 bg-neutral-900"
                  }`}
                  whileHover={{
                    borderColor: node.completed ? "#34d399" : "#737373",
                  }}
                >
                  {/* ===================================== */}
                  {/* DRAG HANDLE                            */}
                  {/* TOP LEFT                               */}
                  {/* ===================================== */}

                  <button
                    type="button"
                    disabled={isPanningEnabled}
                    onPointerDown={(e) => handleDragStart(e, node)}
                    className=" absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 cursor-grab active:cursor-grabbing transition-colors z-10 "
                    aria-label="Drag node"
                  >
                    <FiMove size={15} />
                  </button>

                  {/* ===================================== */}
                  {/* COLLAPSE / EXPAND                      */}
                  {/* TOP RIGHT                              */}
                  {/* ===================================== */}

                  {hasChildren && (
                    <motion.button
                      type="button"
                      disabled={isPanningEnabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse(node.id);
                      }}
                      className=" absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors z-10 "
                      whileHover={{
                        scale: 1.1,
                      }}
                      whileTap={{
                        scale: 0.9,
                      }}
                      aria-label={
                        isCollapsed ? "Expand children" : "Collapse children"
                      }
                    >
                      {isCollapsed ? (
                        <FiChevronRight size={16} />
                      ) : (
                        <FiChevronDown size={16} />
                      )}
                    </motion.button>
                  )}

                  {/* ===================================== */}
                  {/* TEXT + CHECKBOX                        */}
                  {/* ===================================== */}

                  <div className="flex h-full w-full items-start gap-2 p-4 pt-10 pr-4">
                    {/* Checkbox ONLY for leaf nodes */}
                    {!hasChildren && (
                      <button
                        type="button"
                        disabled={isPanningEnabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNodeCompletion(node.id);
                        }}
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          node.completed
                            ? "border-emerald-400 bg-emerald-500 text-white"
                            : "border-neutral-600 bg-neutral-800 hover:border-emerald-400"
                        }`}
                        aria-label={
                          node.completed
                            ? "Mark task as incomplete"
                            : "Mark task as complete"
                        }
                      >
                        {node.completed && (
                          <span className="text-[10px] font-bold">✓</span>
                        )}
                      </button>
                    )}

                    <textarea
                      value={node.text}
                      disabled={isPanningEnabled}
                      onChange={(e) => updateText(node.id, e.target.value)}
                      className={`h-full min-w-0 flex-1 resize-none bg-transparent text-[12px] outline-none hide-scrollbar ${
                        node.completed ? "text-emerald-100" : "text-white"
                      }`}
                      placeholder="Write something"
                    />
                  </div>

                  {/* Right */}
                  <motion.button
                    type="button"
                    disabled={isPanningEnabled}
                    className=" absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-medium opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto shadow-lg z-20 "
                    whileHover={{
                      scale: 1.15,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      createChildNode(node);
                    }}
                  >
                    +
                  </motion.button>

                  {/* Bottom */}
                  <motion.button
                    type="button"
                    disabled={isPanningEnabled}
                    className=" absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-medium opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto shadow-lg z-20 "
                    whileHover={{
                      scale: 1.15,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      createLinkedNode(node);
                    }}
                  >
                    +
                  </motion.button>

                  {/* ===================================== */}
                  {/* DELETE                                  */}
                  {/* BOTTOM RIGHT                            */}
                  {/* ===================================== */}

                  <motion.button
                    type="button"
                    disabled={isPanningEnabled}
                    className=" absolute bottom-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto z-20 "
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();

                      deleteNode(node.id);
                    }}
                    aria-label="Delete node"
                  >
                    <FiTrash2 size={15} />
                  </motion.button>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Canvas;
