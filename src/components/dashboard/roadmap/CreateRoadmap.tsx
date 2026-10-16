import React, { useState } from "react";
import {
  Edit3,
  Plus,
  Trash2,
  CheckSquare,
  ListOrdered,
  FolderGit2,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import type { NodeType, RoadmapData, RoadmapNode, SequentialTask } from "./types";

export type CreateRoadmapProps = {
  roadmap: RoadmapData;
  onChangeRoadmap: (updated: RoadmapData) => void;
  // Breadcrumb trail: e.g. ["Full-Stack Roadmap", "Backend Engine"]
  breadcrumbs: { id: string; title: string }[];
  onNavigateBreadcrumb: (index: number) => void;
  onOpenNestedRoadmap: (nodeId: string) => void;
};

const DEFAULT_COLORS = [
  "#6366f1", // Indigo
  "#38bdf8", // Sky
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#f43f5e", // Rose
  "#14b8a6", // Teal
];

const PRESET_ICONS = ["🚀", "🌱", "⚡", "🧩", "🏛️", "🗄️", "🛡️", "📱", "🎯", "🧠", "🔥", "📚"];

export default function CreateRoadmap({
  roadmap,
  onChangeRoadmap,
  breadcrumbs,
  onNavigateBreadcrumb,
  onOpenNestedRoadmap,
}: CreateRoadmapProps) {
  // Modal / form state for adding or editing a node
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // Form states for new/editing node
  const [nodeType, setNodeType] = useState<NodeType>("single");
  const [nodeTitle, setNodeTitle] = useState("");
  const [nodeIcon, setNodeIcon] = useState("⚡");
  const [nodeColor, setNodeColor] = useState("#6366f1");
  const [nodeDescription, setNodeDescription] = useState("");
  const [nodeCompleted, setNodeCompleted] = useState(false);

  // Sequential tasks state
  const [tasks, setTasks] = useState<SequentialTask[]>([
    { id: "1", title: "Step 1: Core Fundamentals", completed: false },
    { id: "2", title: "Step 2: Hands-on Implementation", completed: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");

  const fullDisplayTitle = breadcrumbs.map((b) => b.title || "Untitled").join(" / ");

  // Handle roadmap base field changes
  const updateField = (field: keyof RoadmapData, value: any) => {
    onChangeRoadmap({
      ...roadmap,
      [field]: value,
    });
  };

  // Open modal to add a fresh node
  const handleOpenAddNode = () => {
    setEditingNodeId(null);
    setNodeType("single");
    setNodeTitle("");
    setNodeIcon(PRESET_ICONS[Math.floor(Math.random() * PRESET_ICONS.length)]);
    setNodeColor(roadmap.color || "#6366f1");
    setNodeDescription("");
    setNodeCompleted(false);
    setTasks([
      { id: Date.now() + "-1", title: "Step 1: Prerequisites & Setup", completed: false },
      { id: Date.now() + "-2", title: "Step 2: Core Concepts & Practice", completed: false },
    ]);
    setNewTaskInput("");
    setIsNodeModalOpen(true);
  };

  // Open modal to edit existing node
  const handleEditNode = (node: RoadmapNode) => {
    setEditingNodeId(node.id);
    setNodeType(node.type);
    setNodeTitle(node.title);
    setNodeIcon(node.icon);
    setNodeColor(node.color);
    setNodeDescription(node.description || "");
    setNodeCompleted(!!node.completed);
    setTasks(node.tasks ? [...node.tasks] : []);
    setNewTaskInput("");
    setIsNodeModalOpen(true);
  };

  // Add sequential task
  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask: SequentialTask = {
      id: Date.now().toString(),
      title: newTaskInput.trim(),
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskInput("");
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleToggleTaskCompleted = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Save Node (Add or Edit)
  const handleSaveNode = () => {
    if (!nodeTitle.trim()) return;

    if (editingNodeId) {
      // Update existing node
      const updatedNodes = roadmap.nodes.map((node) => {
        if (node.id !== editingNodeId) return node;

        if (nodeType === "sequential") {
          return {
            ...node,
            type: "sequential" as NodeType,
            title: nodeTitle.trim(),
            icon: nodeIcon,
            color: nodeColor,
            tasks,
          };
        } else if (nodeType === "nested") {
          return {
            ...node,
            type: "nested" as NodeType,
            title: nodeTitle.trim(),
            icon: nodeIcon,
            color: nodeColor,
            nestedRoadmap: node.nestedRoadmap
              ? { ...node.nestedRoadmap, title: nodeTitle.trim() }
              : {
                  id: Date.now().toString(),
                  title: nodeTitle.trim(),
                  category: roadmap.category,
                  icon: nodeIcon,
                  color: nodeColor,
                  nodes: [],
                },
          };
        } else {
          return {
            ...node,
            type: "single" as NodeType,
            title: nodeTitle.trim(),
            icon: nodeIcon,
            color: nodeColor,
            description: nodeDescription.trim(),
            completed: nodeCompleted,
          };
        }
      });

      onChangeRoadmap({ ...roadmap, nodes: updatedNodes });
    } else {
      // Create new node
      const newNodeId = Date.now().toString();
      let newNode: RoadmapNode;

      if (nodeType === "sequential") {
        newNode = {
          id: newNodeId,
          type: "sequential",
          title: nodeTitle.trim(),
          icon: nodeIcon,
          color: nodeColor,
          tasks,
        };
      } else if (nodeType === "nested") {
        newNode = {
          id: newNodeId,
          type: "nested",
          title: nodeTitle.trim(),
          icon: nodeIcon,
          color: nodeColor,
          nestedRoadmap: {
            id: Date.now().toString(),
            title: nodeTitle.trim(),
            category: roadmap.category,
            icon: nodeIcon,
            color: nodeColor,
            description: "Nested roadmap created under " + roadmap.title,
            nodes: [],
          },
        };
      } else {
        newNode = {
          id: newNodeId,
          type: "single",
          title: nodeTitle.trim(),
          icon: nodeIcon,
          color: nodeColor,
          description: nodeDescription.trim(),
          completed: nodeCompleted,
        };
      }

      onChangeRoadmap({
        ...roadmap,
        nodes: [...roadmap.nodes, newNode],
      });
    }

    setIsNodeModalOpen(false);
  };

  // Delete node
  const handleDeleteNode = (id: string) => {
    onChangeRoadmap({
      ...roadmap,
      nodes: roadmap.nodes.filter((n) => n.id !== id),
    });
  };

  // Move node position
  const handleMoveNode = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= roadmap.nodes.length) return;

    const newNodes = [...roadmap.nodes];
    const temp = newNodes[index];
    newNodes[index] = newNodes[targetIndex];
    newNodes[targetIndex] = temp;

    onChangeRoadmap({ ...roadmap, nodes: newNodes });
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-4 sm:p-6 shadow-sm">
      {/* Breadcrumb Path (especially when nested roadmap is active) */}
      <div className="flex flex-wrap items-center gap-1.5 pb-3 text-xs text-gray-400 border-b border-white/[0.08]">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.id + idx}>
              <button
                type="button"
                onClick={() => onNavigateBreadcrumb(idx)}
                className={`font-medium transition hover:text-white ${
                  isLast ? "text-indigo-400 font-semibold" : "text-gray-400 hover:underline"
                }`}
              >
                {crumb.title || "Untitled"}
              </button>
              {!isLast && <span className="text-gray-600 font-bold">/</span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* Panel Header */}
      <div className="mt-4 flex items-center justify-between pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Edit3 size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white sm:text-base">
              Roadmap Configuration
            </h2>
            <p className="text-[11px] text-gray-400 truncate max-w-[280px] sm:max-w-md">
              {fullDisplayTitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddNode}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Node</span>
        </button>
      </div>

      {/* Main Roadmap Metadata Inputs */}
      <div className="mt-4 space-y-3.5 rounded-xl border border-white/[0.08] bg-[#161616] p-4">
        {/* Title */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300">
            Roadmap Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={roadmap.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g. Full-Stack Mastery"
            className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
          />
        </div>

        {/* Category (Optional) & Icon */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-gray-300">Category</label>
              <span className="text-[10px] text-gray-500 font-normal">Optional</span>
            </div>
            <input
              type="text"
              value={roadmap.category || ""}
              onChange={(e) => updateField("category", e.target.value)}
              placeholder="e.g. Engineering, Architecture..."
              className="w-full rounded-xl border border-white/10 bg-[#1e1e1e] px-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">Icon / Emoji</label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={roadmap.icon}
                onChange={(e) => updateField("icon", e.target.value)}
                className="w-16 text-center rounded-xl border border-white/10 bg-[#1e1e1e] px-2 py-2 text-base text-white outline-none focus:border-indigo-500/60"
              />
              <div className="flex flex-1 items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-[#1e1e1e] px-2 py-1.5">
                {PRESET_ICONS.slice(0, 6).map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => updateField("icon", emoji)}
                    className="rounded p-1 text-sm hover:bg-white/10 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-300">Accent Color</label>
          <div className="flex flex-wrap items-center gap-2">
            {DEFAULT_COLORS.map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => updateField("color", col)}
                className={`h-6 w-6 rounded-full border transition-all ${
                  roadmap.color === col
                    ? "scale-110 border-white ring-2 ring-white/30"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300">Description</label>
          <textarea
            rows={2}
            value={roadmap.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Brief overview of the milestones and curriculum..."
            className="w-full resize-none rounded-xl border border-white/10 bg-[#1e1e1e] px-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
          />
        </div>
      </div>

      {/* Nodes List Section */}
      <div className="mt-5 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Roadmap Nodes ({roadmap.nodes.length})
            </h3>
            <span className="text-[10px] text-gray-500">
              Arranged in horizontal zigzag on preview
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenAddNode}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Node</span>
          </button>
        </div>

        {roadmap.nodes.length === 0 ? (
          <div className="mt-3 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-6 text-center">
            <Sparkles size={24} className="text-gray-500 mb-2" />
            <p className="text-xs font-medium text-gray-300">No nodes added yet</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Click &quot;Add Node&quot; to add a single node, sequential tasks, or nested roadmap.
            </p>
            <button
              type="button"
              onClick={handleOpenAddNode}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer"
            >
              <Plus size={13} />
              Add First Node
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {roadmap.nodes.map((node, index) => {
              return (
                <div
                  key={node.id}
                  className="group relative flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#171717] p-3 transition hover:border-white/20 hover:bg-[#1b1b1b]"
                  style={{
                    borderLeftColor: node.color,
                    borderLeftWidth: "3px",
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-base shrink-0">{node.icon}</span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-gray-100 truncate">
                          {node.title}
                        </span>

                        {node.type === "single" && (
                          <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[9px] font-medium text-blue-400">
                            Single Node
                          </span>
                        )}

                        {node.type === "sequential" && (
                          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-medium text-amber-400">
                            Sequential ({node.tasks?.length || 0} tasks)
                          </span>
                        )}

                        {node.type === "nested" && (
                          <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[9px] font-medium text-purple-400">
                            Nested Roadmap (/)
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-500">
                        <span>Node #{index + 1}</span>
                        {node.type === "single" && (
                          <span>{node.completed ? "✓ Marked Done" : "Incomplete"}</span>
                        )}
                        {node.type === "sequential" && (
                          <span>
                            {node.tasks?.filter((t) => t.completed).length || 0}/
                            {node.tasks?.length || 0} tasks done
                          </span>
                        )}
                        {node.type === "nested" && (
                          <span>
                            {node.nestedRoadmap?.nodes.length || 0} sub-nodes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {node.type === "nested" && (
                      <button
                        type="button"
                        onClick={() => onOpenNestedRoadmap(node.id)}
                        title="Edit Nested Roadmap (/)"
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-500/15 border border-purple-500/30 px-2 py-1 text-[11px] font-medium text-purple-300 hover:bg-purple-500/25 transition cursor-pointer"
                      >
                        <span>Edit Sub-Roadmap</span>
                        <ChevronRight size={12} />
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveNode(index, "up")}
                      title="Move Up"
                      className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    >
                      <ArrowUp size={13} />
                    </button>

                    <button
                      type="button"
                      disabled={index === roadmap.nodes.length - 1}
                      onClick={() => handleMoveNode(index, "down")}
                      title="Move Down"
                      className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    >
                      <ArrowDown size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditNode(node)}
                      title="Edit Node"
                      className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                    >
                      <Edit3 size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteNode(node.id)}
                      title="Delete Node"
                      className="rounded p-1 text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Node Modal */}
      {isNodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#141414] p-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-semibold text-white">
                {editingNodeId ? "Edit Roadmap Node" : "Add New Roadmap Node"}
              </h3>
              <button
                type="button"
                onClick={() => setIsNodeModalOpen(false)}
                className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Prompt for Node Type */}
            <div className="mt-4">
              <label className="mb-2 block text-xs font-semibold text-gray-300">
                Select Node Type:
              </label>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {/* 1. Single Node */}
                <button
                  type="button"
                  onClick={() => setNodeType("single")}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition cursor-pointer ${
                    nodeType === "single"
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-white/10 bg-[#1b1b1b] text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <CheckSquare size={16} className={nodeType === "single" ? "text-blue-400" : ""} />
                  <span className="mt-1.5 text-xs font-semibold text-white">Single Node</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    No sequential tasks, with checkbox
                  </span>
                </button>

                {/* 2. Sequential Tasks */}
                <button
                  type="button"
                  onClick={() => setNodeType("sequential")}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition cursor-pointer ${
                    nodeType === "sequential"
                      ? "border-amber-500 bg-amber-500/10 text-white"
                      : "border-white/10 bg-[#1b1b1b] text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <ListOrdered size={16} className={nodeType === "sequential" ? "text-amber-400" : ""} />
                  <span className="mt-1.5 text-xs font-semibold text-white">Sequential Tasks</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Step-by-step tasks in vertical order
                  </span>
                </button>

                {/* 3. Nested Roadmap */}
                <button
                  type="button"
                  onClick={() => setNodeType("nested")}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition cursor-pointer ${
                    nodeType === "nested"
                      ? "border-purple-500 bg-purple-500/10 text-white"
                      : "border-white/10 bg-[#1b1b1b] text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <FolderGit2 size={16} className={nodeType === "nested" ? "text-purple-400" : ""} />
                  <span className="mt-1.5 text-xs font-semibold text-white">Another Roadmap</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Nested roadmap with &apos;/&apos; breadcrumb
                  </span>
                </button>
              </div>
            </div>

            {/* Dynamic Inputs Based on Node Type */}
            <div className="mt-4 space-y-3">
              {/* Title Input */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-300">
                  {nodeType === "nested"
                    ? "Nested Roadmap Title"
                    : nodeType === "sequential"
                    ? "Module / Topic Title"
                    : "Node Title"}{" "}
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={nodeTitle}
                  onChange={(e) => setNodeTitle(e.target.value)}
                  placeholder={
                    nodeType === "nested"
                      ? "e.g. Microservices & Distributed Architecture"
                      : "e.g. Asynchronous Programming in Node.js"
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#1c1c1c] px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/60"
                />
                {nodeType === "nested" && (
                  <p className="mt-1 text-[10px] text-purple-400">
                    Will be accessed as: &quot;{fullDisplayTitle} / {nodeTitle || "Untitled"}&quot;
                  </p>
                )}
              </div>

              {/* Icon & Accent Color */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-300">
                    Icon / Emoji
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nodeIcon}
                      onChange={(e) => setNodeIcon(e.target.value)}
                      className="w-12 text-center rounded-xl border border-white/10 bg-[#1c1c1c] px-2 py-1.5 text-base text-white outline-none focus:border-indigo-500/60"
                    />
                    <div className="flex flex-1 items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-[#1c1c1c] px-2 py-1.5">
                      {PRESET_ICONS.slice(0, 5).map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setNodeIcon(em)}
                          className="rounded p-0.5 text-xs hover:bg-white/10 transition"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-300">
                    Accent Color
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {DEFAULT_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNodeColor(col)}
                        className={`h-5 w-5 rounded-full border transition-all ${
                          nodeColor === col
                            ? "scale-110 border-white ring-2 ring-white/30"
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Specific fields for Single Node */}
              {nodeType === "single" && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-300">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={nodeDescription}
                      onChange={(e) => setNodeDescription(e.target.value)}
                      placeholder="Brief details or objectives for this single node..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-[#1c1c1c] px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/60"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#1c1c1c] p-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nodeCompleted}
                      onChange={(e) => setNodeCompleted(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500/30"
                    />
                    <div>
                      <span className="text-xs font-medium text-gray-200">
                        Mark Node as Completed
                      </span>
                      <p className="text-[10px] text-gray-500">
                        Check to set this single node as already mastered
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Specific fields for Sequential Tasks Node */}
              {nodeType === "sequential" && (
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-gray-300">
                        Sequential Tasks (Vertical Order)
                      </label>
                      <span className="text-[10px] text-amber-400 font-medium">
                        First must be done first, then second, third...
                      </span>
                    </div>

                    {/* Task addition input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTaskInput}
                        onChange={(e) => setNewTaskInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTask();
                          }
                        }}
                        placeholder="Add next sequential task and press Enter..."
                        className="flex-1 rounded-xl border border-white/10 bg-[#1c1c1c] px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-500/60"
                      />
                      <button
                        type="button"
                        onClick={handleAddTask}
                        className="inline-flex items-center gap-1 rounded-xl bg-amber-500/20 border border-amber-500/30 px-3 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/30 transition cursor-pointer"
                      >
                        <Plus size={13} />
                        Add
                      </button>
                    </div>

                    {/* Vertical list of sequential tasks */}
                    <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {tasks.map((task, idx) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between rounded-lg border border-white/5 bg-[#181818] px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400">
                              {idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleTaskCompleted(task.id)}
                              className={`flex items-center gap-2 text-left truncate cursor-pointer ${
                                task.completed ? "text-gray-500 line-through" : "text-gray-200"
                              }`}
                            >
                              <div
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                                  task.completed
                                    ? "border-emerald-500 bg-emerald-500 text-black"
                                    : "border-gray-500 bg-black/40"
                                }`}
                              >
                                {task.completed && <Check size={11} strokeWidth={3} />}
                              </div>
                              <span className="truncate">{task.title}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveTask(task.id)}
                            className="rounded p-1 text-gray-500 hover:text-rose-400 transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}

                      {tasks.length === 0 && (
                        <p className="text-center py-3 text-[11px] text-gray-500">
                          No sequential tasks added yet. Add at least one task above.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Specific fields for Nested Roadmap */}
              {nodeType === "nested" && (
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-xs text-purple-200">
                  <div className="flex items-start gap-2">
                    <FolderGit2 size={16} className="mt-0.5 text-purple-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-purple-300">
                        Nested Roadmap Architecture
                      </span>
                      <p className="mt-0.5 text-[11px] text-purple-300/80 leading-relaxed">
                        This creates a full sub-roadmap. After saving, you can click &quot;Edit Sub-Roadmap&quot;
                        to define its internal nodes and milestones under the breadcrumb path:
                        <br />
                        <code className="text-[10px] text-white bg-black/40 px-1 py-0.5 rounded mt-1 inline-block">
                          {fullDisplayTitle} / {nodeTitle || "&lt;Title&gt;"}
                        </code>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/[0.08] pt-3">
              <button
                type="button"
                onClick={() => setIsNodeModalOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!nodeTitle.trim()}
                onClick={handleSaveNode}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <Check size={14} />
                <span>{editingNodeId ? "Update Node" : "Save Node"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
