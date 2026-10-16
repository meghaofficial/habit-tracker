import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion } from "framer-motion";
import {
  handleClasses,
  handles,
  type Direction,
  type EdgeI,
  type Handle,
  type MoveSession,
  type ResizeSession,
} from "./canvasUtility";
import { FiMove } from "react-icons/fi";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
} from "react-icons/fa";

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

const INITIAL_WIDTH = 100;
const INITIAL_HEIGHT = 30;
const MAX_WIDTH = 150;
const MIN_HEIGHT = 20;
const MIN_WIDTH = 60;

const Canvas = ({ nodes, setNodes }: CanvasProps) => {
  const nextId = useRef(1);
  const textareaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const resizeRef = useRef<ResizeSession | null>(null);
  const moveRef = useRef<MoveSession | null>(null);
  const [edges, setEdges] = useState<EdgeI[]>([]);

  // Create one default node.
  useEffect(() => {
    if (nodes.length === 0) {
      const id = nextId.current++;

      setNodes([
        {
          id,
          text: "",
          x: 80,
          y: 80,
          width: INITIAL_WIDTH,
          height: INITIAL_HEIGHT,
          completed: false,
        },
      ]);
    } else {
      nextId.current = Math.max(
        nextId.current,
        ...nodes.map((node) => node.id + 1),
      );
    }
  }, [nodes.length, setNodes]);

  const updateNodeText = (id: number, text: string) => {
    const textarea = textareaRefs.current[id];
    const measure = measureRef.current;

    let width = INITIAL_WIDTH;
    let height = MIN_HEIGHT;

    if (text.length > 0 && measure && textarea) {
      const style = window.getComputedStyle(textarea);

      measure.style.font = style.font;
      measure.style.letterSpacing = style.letterSpacing;
      measure.textContent = text.replace(/\n/g, " ");

      const measuredWidth = measure.getBoundingClientRect().width;

      // Grow horizontally up to 150px.
      width = Math.min(
        MAX_WIDTH,
        Math.max(INITIAL_WIDTH, Math.ceil(measuredWidth + 20)),
      );

      // Once the maximum width is reached, wrap text and grow vertically.
      textarea.style.width = `${width}px`;
      textarea.style.height = "auto";

      height = Math.max(MIN_HEIGHT, Math.ceil(textarea.scrollHeight));
    }

    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, text, width, height } : node,
      ),
    );
  };

  // Measure the height needed to display all text at a specific width.
  const getRequiredHeight = (text: string, width: number, id: number) => {
    const textarea = textareaRefs.current[id];

    if (!textarea || !text) return MIN_HEIGHT;

    const clone = textarea.cloneNode(true) as HTMLTextAreaElement;
    const computed = window.getComputedStyle(textarea);

    clone.value = text;
    clone.style.position = "fixed";
    clone.style.left = "-10000px";
    clone.style.top = "0";
    clone.style.visibility = "hidden";
    clone.style.pointerEvents = "none";
    clone.style.width = `${width}px`;
    clone.style.height = "auto";
    clone.style.minHeight = "0";
    clone.style.maxHeight = "none";
    clone.style.overflow = "hidden";
    clone.style.boxSizing = "border-box";
    clone.style.font = computed.font;
    clone.style.letterSpacing = computed.letterSpacing;
    clone.style.lineHeight = computed.lineHeight;
    clone.style.padding = computed.padding;
    clone.style.border = computed.border;
    clone.style.whiteSpace = "pre-wrap";
    clone.style.overflowWrap = "anywhere";

    document.body.appendChild(clone);

    const requiredHeight = Math.ceil(clone.scrollHeight);

    clone.remove();

    return Math.max(MIN_HEIGHT, requiredHeight);
  };

  const startResize = (
    event: ReactPointerEvent<HTMLDivElement>,
    node: NodeI,
    handle: Handle,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveNodeId(node.id);

    const startWidth = node.width ?? INITIAL_WIDTH;
    const startHeight = node.height ?? INITIAL_HEIGHT;

    // Calculate text constraints once at the start, not on every move.
    const minWidth = MIN_WIDTH;
    const minHeight = getRequiredHeight(node.text, startWidth, node.id);

    resizeRef.current = {
      pointerId: event.pointerId,
      nodeId: node.id,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      startWidth,
      startHeight,
      startLeft: node.x,
      startTop: node.y,
      minWidth,
      minHeight,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const resizeNode = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = resizeRef.current;

    if (!session || session.pointerId !== event.pointerId) return;

    event.preventDefault();

    const {
      nodeId,
      handle,
      startX,
      startY,
      startWidth,
      startHeight,
      startLeft,
      startTop,
      minWidth,
      minHeight,
    } = session;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    let width = startWidth;
    let height = startHeight;
    let x = startLeft;
    let y = startTop;

    if (handle.includes("e")) {
      width = Math.max(minWidth, startWidth + dx);
    }

    if (handle.includes("w")) {
      width = Math.max(minWidth, startWidth - dx);
      x = startLeft + startWidth - width;
    }

    if (handle.includes("s")) {
      height = Math.max(minHeight, startHeight + dy);
    }

    if (handle.includes("n")) {
      height = Math.max(minHeight, startHeight - dy);
      y = startTop + startHeight - height;
    }

    // Keep the opposite edge anchored for top/left handles.
    if (handle.includes("n")) {
      y = startTop + startHeight - height;
    }

    if (handle.includes("w")) {
      x = startLeft + startWidth - width;
    }

    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, x, y, width, height } : node,
      ),
    );
  };

  const endResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (resizeRef.current?.pointerId !== event.pointerId) return;

    resizeRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const startMove = (event: ReactPointerEvent<HTMLDivElement>, node: NodeI) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveNodeId(node.id);

    moveRef.current = {
      pointerId: event.pointerId,
      nodeId: node.id,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: node.x,
      startTop: node.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveNode = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = moveRef.current;

    if (!session || session.pointerId !== event.pointerId) return;

    event.preventDefault();

    const dx = event.clientX - session.startX;
    const dy = event.clientY - session.startY;

    setNodes((prev) =>
      prev.map((node) =>
        node.id === session.nodeId
          ? {
              ...node,
              x: session.startLeft + dx,
              y: session.startTop + dy,
            }
          : node,
      ),
    );
  };

  const endMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (moveRef.current?.pointerId !== event.pointerId) return;

    moveRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const addConnectedNode = (source: NodeI, direction: Direction) => {
    const id = nextId.current++;
    const width = INITIAL_WIDTH;
    const height = INITIAL_HEIGHT;
    const gap = 90;

    let x = source.x;
    let y = source.y;

    switch (direction) {
      case "top":
        x = source.x;
        y = source.y - height - gap;
        break;

      case "bottom":
        x = source.x;
        y = source.y + (source.height ?? INITIAL_HEIGHT) + gap;
        break;

      case "left":
        x = source.x - width - gap;
        y = source.y;
        break;

      case "right":
        x = source.x + (source.width ?? INITIAL_WIDTH) + gap;
        y = source.y;
        break;
    }

    const newNode: NodeI = {
      id,
      text: "",
      x,
      y,
      width,
      height,
      completed: false,
    };

    setNodes((prev) => [...prev, newNode]);

    setEdges((prev) => [
      ...prev,
      {
        id: `${source.id}-${id}`,
        from: source.id,
        to: id,
        direction,
      },
    ]);

    setActiveNodeId(id);
  };

  return (
    <div
      className="relative h-screen w-full overflow-auto rounded-xl border border-[#303341] bg-[#171821] text-gray-100"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          setActiveNodeId(null);
        }
      }}
      style={{
        backgroundImage:
          "radial-gradient(circle, #383a49 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Hidden text measurement element */}
      <span
        ref={measureRef}
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre text-xs"
        aria-hidden="true"
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <marker
            id="canvas-arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#818cf8" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const from = nodes.find((node) => node.id === edge.from);
          const to = nodes.find((node) => node.id === edge.to);

          if (!from || !to) return null;

          const fw = from.width ?? INITIAL_WIDTH;
          const fh = from.height ?? INITIAL_HEIGHT;
          const tw = to.width ?? INITIAL_WIDTH;
          const th = to.height ?? INITIAL_HEIGHT;

          let sx = from.x + fw / 2;
          let sy = from.y + fh / 2;
          let ex = to.x + tw / 2;
          let ey = to.y + th / 2;

          let d = "";

          if (edge.direction === "right") {
            sx = from.x + fw;
            sy = from.y + fh / 2;
            ex = to.x;
            ey = to.y + th / 2;

            const curve = Math.max(35, Math.abs(ex - sx) * 0.45);
            d = `M ${sx} ${sy} C ${sx + curve} ${sy}, ${ex - curve} ${ey}, ${ex} ${ey}`;
          } else if (edge.direction === "left") {
            sx = from.x;
            sy = from.y + fh / 2;
            ex = to.x + tw;
            ey = to.y + th / 2;

            const curve = Math.max(35, Math.abs(sx - ex) * 0.45);
            d = `M ${sx} ${sy} C ${sx - curve} ${sy}, ${ex + curve} ${ey}, ${ex} ${ey}`;
          } else if (edge.direction === "bottom") {
            sx = from.x + fw / 2;
            sy = from.y + fh;
            ex = to.x + tw / 2;
            ey = to.y;

            const curve = Math.max(35, Math.abs(ey - sy) * 0.45);
            d = `M ${sx} ${sy} C ${sx} ${sy + curve}, ${ex} ${ey - curve}, ${ex} ${ey}`;
          } else {
            sx = from.x + fw / 2;
            sy = from.y;
            ex = to.x + tw / 2;
            ey = to.y + th;

            const curve = Math.max(35, Math.abs(sy - ey) * 0.45);
            d = `M ${sx} ${sy} C ${sx} ${sy - curve}, ${ex} ${ey + curve}, ${ex} ${ey}`;
          }

          return (
            <motion.path
              key={edge.id}
              d={d}
              fill="none"
              stroke="#818cf8"
              strokeWidth={2}
              strokeLinecap="round"
              markerEnd="url(#canvas-arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 0.45, ease: "easeInOut" },
                opacity: { duration: 0.2 },
              }}
            />
          );
        })}
      </svg>

      {nodes.map((node) => {
        const isActive = activeNodeId === node.id;
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onPointerDown={() => setActiveNodeId(node.id)}
            className="absolute"
            style={{
              left: node.x,
              top: node.y,
            }}
          >
            <motion.div
              className="rounded-md border border-[#414352] bg-[#20222c] shadow-lg transition-colors focus-within:border-indigo-400"
              style={{
                width: node.width ?? INITIAL_WIDTH,
                minHeight: node.height ?? INITIAL_HEIGHT,
              }}
            >
              <textarea
                ref={(element) => {
                  textareaRefs.current[node.id] = element;
                }}
                value={node.text}
                onChange={(event) =>
                  updateNodeText(node.id, event.target.value)
                }
                placeholder=""
                aria-label="Node text"
                rows={1}
                className="block resize-none overflow-hidden bg-transparent p-2 text-xs leading-5 text-gray-100 outline-none placeholder:text-gray-500"
                style={{
                  width: node.width ?? INITIAL_WIDTH,
                  minHeight: node.height ?? INITIAL_HEIGHT,
                  boxSizing: "border-box",
                  overflowWrap: "anywhere",
                }}
              />

              {isActive &&
                handles.map((handle) => (
                  <div
                    key={handle}
                    role="presentation"
                    onPointerDown={(event) => startResize(event, node, handle)}
                    onPointerMove={resizeNode}
                    onPointerUp={endResize}
                    onPointerCancel={endResize}
                    className={`absolute ${handleClasses[handle]} ${
                      handle.length === 1
                        ? "rounded-sm"
                        : "border border-[#171821]"
                    } bg-indigo-400 opacity-90 shadow-sm hover:opacity-100`}
                    style={{ touchAction: "none" }}
                  />
                ))}

              {isActive && (
                <div
                  onPointerDown={(event) => startMove(event, node)}
                  onPointerMove={moveNode}
                  onPointerUp={endMove}
                  onPointerCancel={endMove}
                  className="absolute -right-10 top-14 z-20 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border border-[#414352] bg-[#292c39] text-gray-300 shadow-md transition-colors hover:bg-[#363949] hover:text-white active:cursor-grabbing"
                  style={{ touchAction: "none" }}
                  title="Move node"
                >
                  <FiMove size={10} />
                </div>
              )}

              {isActive && (
                <>
                  {/* Top */}
                  <button
                    type="button"
                    title="Add node above"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      addConnectedNode(node, "top");
                    }}
                    className="absolute left-1/2 top-0 z-30 flex h-6 w-6 -translate-x-1/2 -translate-y-[calc(100%+12px)] items-center justify-center rounded-full border border-[#414352] bg-[#292c39] transition-colors"
                  >
                    <FaArrowUp size={10} />
                  </button>

                  {/* Bottom */}
                  <button
                    type="button"
                    title="Add node below"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      addConnectedNode(node, "bottom");
                    }}
                    className="absolute bottom-0 left-1/2 z-30 flex h-6 w-6 -translate-x-1/2 translate-y-[calc(100%+12px)] items-center justify-center rounded-full border border-[#414352] bg-[#292c39] transition-colors"
                  >
                    <FaArrowDown size={10} />
                  </button>

                  {/* Left */}
                  <button
                    type="button"
                    title="Add node to the left"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      addConnectedNode(node, "left");
                    }}
                    className="absolute left-0 top-1/2 z-30 flex h-6 w-6 -translate-x-[calc(100%+12px)] -translate-y-1/2 items-center justify-center rounded-full border border-[#414352] bg-[#292c39] transition-colors"
                  >
                    <FaArrowLeft size={10} />
                  </button>

                  {/* Right */}
                  <button
                    type="button"
                    title="Add node to the right"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      addConnectedNode(node, "right");
                    }}
                    className="absolute right-0 top-1/2 z-30 flex h-6 w-6 translate-x-[calc(100%+12px)] -translate-y-1/2 items-center justify-center rounded-full border border-[#414352] bg-[#292c39] transition-colors"
                  >
                    <FaArrowRight size={10} />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Canvas;
