// import { useState } from "react";
// import type { RoadmapItem } from "../types";
// import { notify } from "../../../../helper";
// import { roadmapApi } from "../../../../api/roadmap.api";
// import { DEFAULT_COLORS, PRESET_ICONS } from "../testData";
// import CircleLoader from "../../../loaders/CircleLoader";

// const CreationForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [roadmapConfig, setRoadmapConfig] = useState<RoadmapItem>({
//     _id: "",
//     title: "",
//     description: "",
//     icon: "",
//     total_nodes_count: 0,
//     completed_nodes_count: 0,
//     status: "pending",
//     accent_color: "",
//     category: "",
//   });

//   const updateField = (field: keyof RoadmapItem, value: any) => {
//     setRoadmapConfig((prev) => ({ ...prev, [field]: value }));
//   };

//   const createRoadmap = async () => {
//     if (!roadmapConfig.title) {
//       notify.error("Title is mandatory");
//       return;
//     }
//     setLoading(true);
//     try {
//       await roadmapApi.create(roadmapConfig);
//       notify.success("Created Successfully");
//       // setShowBelow(true);
//     } catch (error) {
//       console.error("Failed to load roadmaps:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-2.5">
//       {/* Title */}
//       <div>
//         <label className="mb-1 block text-[11px] font-medium text-gray-300">
//           Roadmap Title <span className="text-rose-400">*</span>
//         </label>
//         <input
//           type="text"
//           value={roadmapConfig.title}
//           onChange={(e) => updateField("title", e.target.value)}
//           placeholder="e.g. Full-Stack Mastery"
//           className="w-full rounded-lg border border-white/10 bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/60"
//         />
//       </div>

//       {/* Category + Icon */}
//       <div className="grid grid-cols-[1fr_auto] gap-2">
//         <div className="min-w-0">
//           <label className="mb-1 block text-[11px] font-medium text-gray-300">
//             Category{" "}
//             <span className="text-gray-500 font-normal">(Optional)</span>
//           </label>
//           <input
//             type="text"
//             value={roadmapConfig.category || ""}
//             onChange={(e) => updateField("category", e.target.value)}
//             placeholder="e.g. Engineering"
//             className="w-full rounded-lg border border-white/10 bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/60"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block text-[11px] font-medium text-gray-300">
//             Icon
//           </label>
//           <div className="flex h-7.5 items-center gap-2">
//             <input
//               type="text"
//               value={roadmapConfig.icon}
//               onChange={(e) => updateField("icon", e.target.value)}
//               className="h-full w-9 rounded-lg border border-white/10 bg-[#1e1e1e] text-center text-sm text-white outline-none focus:border-indigo-500/60"
//             />
//             <div className="flex h-full min-w-28 items-center gap-0.5 overflow-x-auto rounded-lg border border-white/10 bg-[#1e1e1e] px-1">
//               {PRESET_ICONS.slice(0, 6).map((emoji) => (
//                 <button
//                   key={emoji}
//                   type="button"
//                   onClick={() => updateField("icon", emoji)}
//                   className="shrink-0 rounded p-1 text-xs transition hover:bg-white/10"
//                 >
//                   {emoji}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Accent Color */}
//       <div>
//         <label className="mb-1.5 block text-[11px] font-medium text-gray-300">
//           Accent Color
//         </label>
//         <div className="flex items-center gap-1.5">
//           {DEFAULT_COLORS.map((col) => (
//             <button
//               key={col}
//               type="button"
//               onClick={() => updateField("accent_color", col)}
//               aria-label={`Select color ${col}`}
//               className={`h-5 w-5 rounded-full border transition ${
//                 roadmapConfig.accent_color === col
//                   ? "scale-110 border-white ring-1 ring-white/30"
//                   : "border-transparent opacity-75 hover:opacity-100"
//               }`}
//               style={{ backgroundColor: col }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Description */}
//       <div>
//         <label className="mb-1 block text-[11px] font-medium text-gray-300">
//           Description{" "}
//           <span className="text-gray-500 font-normal">(Optional)</span>
//         </label>
//         <textarea
//           rows={2}
//           value={roadmapConfig.description || ""}
//           onChange={(e) => updateField("description", e.target.value)}
//           placeholder="Brief overview of the roadmap..."
//           className="w-full resize-none rounded-lg border border-white/10 bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/60"
//         />
//       </div>

//       {/* Button */}
//       <div className="flex justify-end pt-0.5">
//         <button
//           type="button"
//           onClick={() => {
//             if (loading) {
//               return;
//             }
//             createRoadmap();
//           }}
//           className="rounded-lg bg-indigo-500 min-w-25 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-600 active:scale-95"
//         >
//           {loading ? <CircleLoader className="h-4 w-4" /> : "Save and Next →"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreationForm;

import { useState } from "react";
import type { ListPoint, RoadmapItem } from "../types";
import { notify } from "../../../../helper";
import { roadmapApi } from "../../../../api/roadmap.api";
import { DEFAULT_COLORS, PRESET_ICONS } from "../testData";
import CircleLoader from "../../../loaders/CircleLoader";

type ListPointAction = "add" | "update" | "delete" | "reorder";

type CreationFormProps = {
  parentId: string | null;
  parentName: string | null;
  initialData?: Partial<RoadmapItem>;
  onCreated: (item: RoadmapItem) => void;
  onCancel: () => void;

  onListPointsChange?: (
    points: ListPoint[],
    action: ListPointAction,
  ) => void | Promise<void>;
};

const CreationForm = ({
  parentId,
  parentName,
  initialData,
  onCreated,
  onCancel,
}: CreationFormProps) => {
  const [loading, setLoading] = useState(false);

  const [roadmapConfig, setRoadmapConfig] = useState<RoadmapItem>({
    _id: "",
    title: "",
    description: "",
    icon: "🗺️",
    total_nodes_count: 0,
    completed_nodes_count: 0,
    status: "pending",
    accent_color: DEFAULT_COLORS[0] ?? "#6366f1",
    category: "",
    type: "roadmap",
    points: [],
    ...initialData,
  });

  const [type, setType] = useState<"roadmap" | "list">(
    initialData?.type ?? "roadmap",
  );

  const updateField = (field: keyof RoadmapItem, value: string | number) => {
    setRoadmapConfig((prev) => ({ ...prev, [field]: value }));
  };

  const createRoadmap = async () => {
    if (!roadmapConfig.title.trim()) {
      notify.error("Title is mandatory");
      return;
    }

    setLoading(true);

    try {
      const response = await roadmapApi.create({
        ...roadmapConfig,
        title: roadmapConfig.title.trim(),
        type,
        parent_id: parentId,
      });

      // Adjust this path if your API wrapper returns a different shape.
      const createdItem = response.data?.data?.data ?? response.data?.data;

      if (!createdItem?._id) {
        throw new Error("Created item ID was not returned by the API");
      }

      notify.success("Created successfully");
      onCreated(createdItem);
    } catch (error) {
      console.error("Failed to create roadmap item:", error);
      notify.error("Failed to create roadmap item");
    } finally {
      setLoading(false);
    }
  };

  // List points

  const handlePointsChange = async (
    nextPoints: ListPoint[],
    action: ListPointAction,
  ) => {
    // Update the UI immediately.
    setRoadmapConfig((prev) => ({ ...prev, points: nextPoints }));

    // API integration hook: connect this to your endpoint later.
    try {
      await onListPointsChange?.(nextPoints, action);
    } catch (error) {
      console.error(`Failed to ${action} list points:`, error);
      notify.error("Failed to save list changes");
    }
  };

  const addPoint = () => {
    const nextPoints = [
      ...roadmapConfig.points,
      {
        id: crypto.randomUUID(),
        text: "",
        order: points.length,
      },
    ];

    void handlePointsChange(nextPoints, "add");
  };

  const updatePoint = (id: string, text: string) => {
    const nextPoints = points.map((point) =>
      point.id === id ? { ...point, text } : point,
    );

    void handlePointsChange(nextPoints, "update");
  };

  const deletePoint = (id: string) => {
    const nextPoints = points
      .filter((point) => point.id !== id)
      .map((point, index) => ({ ...point, order: index }));

    void handlePointsChange(nextPoints, "delete");
  };

  const movePoint = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= points.length) return;

    const nextPoints = [...points];
    [nextPoints[index], nextPoints[targetIndex]] = [
      nextPoints[targetIndex],
      nextPoints[index],
    ];

    const reorderedPoints = nextPoints.map((point, order) => ({
      ...point,
      order,
    }));

    void handlePointsChange(reorderedPoints, "reorder");
  };

  return (
    <div className="space-y-2.5">
      {/* Title */}
      <div>
        <label className="mb-1 block text-[11px] font-medium text-gray-300">
          Title <span className="text-rose-400">*</span>
        </label>
        <input
          autoFocus
          value={roadmapConfig.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g. Frontend Development"
          className="w-full rounded-lg border border-white/10 bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-gray-500 focus:border-indigo-500/60"
        />
      </div>

      {/* Type */}
      <div>
        <label className="mb-1 block text-[11px] text-gray-300">
          Node Type
        </label>
        <div className="flex gap-2">
          {(["roadmap", "list"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`rounded-lg border px-3 py-1.5 text-xs capitalize ${
                type === value
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                  : "border-white/10 bg-[#1e1e1e] text-gray-400"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Category + Icon */}
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div className="min-w-0">
          <label className="mb-1 block text-[11px] text-gray-300">
            Category <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            value={roadmapConfig.category || ""}
            onChange={(e) => updateField("category", e.target.value)}
            placeholder="Engineering"
            className="w-full rounded-lg border border-white/10 bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-gray-500 focus:border-indigo-500/60"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-gray-300">Icon</label>
          <div className="flex h-[30px] items-center gap-1">
            <input
              value={roadmapConfig.icon || ""}
              onChange={(e) => updateField("icon", e.target.value)}
              className="h-full w-9 rounded-lg border border-white/10 bg-[#1e1e1e] text-center text-sm text-white"
            />
            <div className="flex h-full max-w-[100px] items-center gap-0.5 overflow-x-auto rounded-lg border border-white/10 bg-[#1e1e1e] px-1">
              {PRESET_ICONS.slice(0, 6).map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => updateField("icon", emoji)}
                  className="shrink-0 rounded p-1 text-xs hover:bg-white/10"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accent color */}
      <div>
        <label className="mb-1.5 block text-[11px] text-gray-300">
          Accent Color
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateField("accent_color", color)}
              aria-label={`Select ${color}`}
              className={`h-5 w-5 rounded-full border transition ${
                roadmapConfig.accent_color === color
                  ? "scale-110 border-white ring-1 ring-white/30"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-[11px] text-gray-300">
          Description <span className="text-gray-500">(Optional)</span>
        </label>
        <textarea
          rows={2}
          value={roadmapConfig.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Brief overview..."
          className="w-full resize-none rounded-lg border border-white/10 bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-gray-500 focus:border-indigo-500/60"
        />
      </div>

      {/* Parent */}
      <div className="rounded-lg bg-white/3 px-2.5 py-2">
        <div className="text-[10px] text-gray-500">Parent node</div>
        <div className="mt-0.5 text-xs text-gray-300">
          {parentName || "Root node"}
        </div>
        {parentId && (
          <div className="mt-1 truncate font-mono text-[9px] text-gray-500">
            {parentId}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={createRoadmap}
          className="flex min-w-24 items-center justify-center rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-600 disabled:opacity-60"
        >
          {loading ? <CircleLoader className="h-4 w-4" /> : "Save node →"}
        </button>
      </div>
    </div>
  );
};

export default CreationForm;

// import { useState } from "react";

// type NodeType = "roadmap" | "list";

// type RoadmapNodeDraft = {
//   id: string;
//   title: string;
//   description: string;
//   type: NodeType;
//   children: RoadmapNodeDraft[];
// };

// type RoadmapNodePayload = {
//   id: string;
//   title: string;
//   description: string;
//   type: NodeType;
//   parent_id: string | null;
//   parent_name: string | null;
//   children: RoadmapNodePayload[];
// };

// type Props = {
//   onSave?: (tree: RoadmapNodePayload) => void;
// };

// const createNode = (title = ""): RoadmapNodeDraft => ({
//   id: crypto.randomUUID(),
//   title,
//   description: "",
//   type: "roadmap",
//   children: [],
// });

// function updateNode(
//   nodes: RoadmapNodeDraft[],
//   id: string,
//   changes: Partial<RoadmapNodeDraft>,
// ): RoadmapNodeDraft[] {
//   return nodes.map((node) => ({
//     ...node,
//     ...(node.id === id ? changes : {}),
//     children: updateNode(node.children, id, changes),
//   }));
// }

// function addChild(
//   nodes: RoadmapNodeDraft[],
//   parentId: string,
// ): RoadmapNodeDraft[] {
//   return nodes.map((node) => ({
//     ...node,
//     children:
//       node.id === parentId
//         ? [...node.children, createNode()]
//         : addChild(node.children, parentId),
//   }));
// }

// function removeNode(nodes: RoadmapNodeDraft[], id: string): RoadmapNodeDraft[] {
//   return nodes
//     .filter((node) => node.id !== id)
//     .map((node) => ({
//       ...node,
//       children: removeNode(node.children, id),
//     }));
// }

// function buildPayload(
//   node: RoadmapNodeDraft,
//   parent: RoadmapNodeDraft | null,
// ): RoadmapNodePayload {
//   return {
//     id: node.id,
//     title: node.title.trim(),
//     description: node.description.trim(),
//     type: node.type,
//     parent_id: parent?.id ?? null,
//     parent_name: parent?.title.trim() || null,
//     children: node.children.map((child) => buildPayload(child, node)),
//   };
// }

// function RoadmapNodeEditor({
//   node,
//   parent,
//   depth,
//   isRoot,
//   onChange,
//   onAddChild,
//   onRemove,
// }: {
//   node: RoadmapNodeDraft;
//   parent: RoadmapNodeDraft | null;
//   depth: number;
//   isRoot: boolean;
//   onChange: (id: string, changes: Partial<RoadmapNodeDraft>) => void;
//   onAddChild: (id: string) => void;
//   onRemove: (id: string) => void;
// }) {
//   return (
//     <div className="relative min-w-0">
//       {/* Node card */}
//       <article
//         className={`w-[280px] shrink-0 overflow-hidden rounded-xl border bg-[#171717] shadow-lg shadow-black/10 transition-colors ${
//           isRoot
//             ? "border-indigo-500/40"
//             : "border-white/10 hover:border-white/20"
//         }`}
//       >
//         {/* Card header */}
//         <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-3 py-2">
//           <div className="flex min-w-0 items-center gap-2">
//             <span
//               className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold ${
//                 isRoot
//                   ? "bg-indigo-500/15 text-indigo-300"
//                   : "bg-white/[0.07] text-gray-300"
//               }`}
//             >
//               {depth + 1}
//             </span>

//             <span className="truncate text-[11px] font-medium text-gray-300">
//               {isRoot ? "Root node" : `Level ${depth + 1}`}
//             </span>
//           </div>

//           <div className="flex items-center gap-1.5">
//             <span
//               className={`rounded-md px-1.5 py-0.5 text-[9px] ${
//                 node.type === "roadmap"
//                   ? "bg-indigo-500/10 text-indigo-300"
//                   : "bg-emerald-500/10 text-emerald-300"
//               }`}
//             >
//               {node.type}
//             </span>

//             {!isRoot && (
//               <button
//                 type="button"
//                 onClick={() => onRemove(node.id)}
//                 title="Delete this node and its descendants"
//                 className="rounded px-1.5 py-1 text-xs text-gray-500 hover:bg-rose-500/10 hover:text-rose-400"
//               >
//                 ×
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Card body */}
//         <div className="space-y-3 p-3">
//           <div>
//             <label className="mb-1 block text-[10px] text-gray-400">
//               Title <span className="text-rose-400">*</span>
//             </label>
//             <input
//               value={node.title}
//               onChange={(e) => onChange(node.id, { title: e.target.value })}
//               placeholder="e.g. Frontend Development"
//               className="w-full rounded-lg border border-white/10 bg-[#202020] px-2.5 py-2 text-xs text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/60"
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-[10px] text-gray-400">
//               Description
//             </label>
//             <textarea
//               rows={2}
//               value={node.description}
//               onChange={(e) =>
//                 onChange(node.id, {
//                   description: e.target.value,
//                 })
//               }
//               placeholder="What will this cover?"
//               className="w-full resize-y rounded-lg border border-white/10 bg-[#202020] px-2.5 py-2 text-xs text-white outline-none placeholder:text-gray-600 focus:border-indigo-500/60"
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-[10px] text-gray-400">
//               Node type
//             </label>
//             <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#202020] p-1">
//               {(["roadmap", "list"] as const).map((type) => (
//                 <button
//                   key={type}
//                   type="button"
//                   onClick={() => onChange(node.id, { type })}
//                   className={`rounded-md py-1.5 text-[11px] capitalize transition ${
//                     node.type === type
//                       ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30"
//                       : "text-gray-500 hover:text-gray-300"
//                   }`}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Derived parent information */}
//           <div className="rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-2">
//             <div className="mb-1 text-[9px] uppercase tracking-wider text-gray-500">
//               Parent
//             </div>

//             <div className="truncate text-[11px] text-gray-300">
//               {parent?.title.trim() || (
//                 <span className="text-gray-600">
//                   {isRoot ? "No parent — root node" : "Untitled parent"}
//                 </span>
//               )}
//             </div>

//             <div className="mt-1 truncate font-mono text-[9px] text-gray-600">
//               {parent?.id ?? "parent_id: null"}
//             </div>
//           </div>

//           {/* Add child */}
//           <button
//             type="button"
//             onClick={() => onAddChild(node.id)}
//             className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 py-2 text-[11px] text-gray-300 transition hover:border-indigo-500/50 hover:bg-indigo-500/[0.06] hover:text-indigo-300"
//           >
//             <span className="text-sm">+</span>
//             Add child node
//           </button>

//           <div className="flex items-center justify-between text-[9px] text-gray-600">
//             <span className="truncate">ID: {node.id.slice(0, 8)}</span>
//             <span>{node.children.length} children</span>
//           </div>
//         </div>
//       </article>

//       {/* Recursive children, arranged sequentially */}
//       {node.children.length > 0 && (
//         <div className="relative ml-5 mt-6 border-l border-white/10 pl-5">
//           <div className="mb-3 flex items-center gap-2">
//             <span className="text-[10px] font-medium text-gray-400">
//               Child nodes
//             </span>
//             <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-gray-500">
//               {node.children.length}
//             </span>
//           </div>

//           <div className="flex items-start gap-5 overflow-x-auto pb-3 pt-1">
//             {node.children.map((child, index) => (
//               <div
//                 key={child.id}
//                 className="relative shrink-0 before:absolute before:-left-5 before:top-4 before:w-5 before:border-t before:border-white/10"
//               >
//                 <div className="mb-2 text-[9px] text-gray-600">
//                   {index + 1}
//                   {index === 0
//                     ? " · First"
//                     : index === node.children.length - 1
//                       ? " · Last"
//                       : " · Next"}
//                 </div>

//                 <RoadmapNodeEditor
//                   node={child}
//                   parent={node}
//                   depth={depth + 1}
//                   isRoot={false}
//                   onChange={onChange}
//                   onAddChild={onAddChild}
//                   onRemove={onRemove}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function CreationForm({ onSave }: Props) {
//   const [root, setRoot] = useState<RoadmapNodeDraft>(() =>
//     createNode("My Roadmap"),
//   );

//   const [error, setError] = useState("");

//   const handleChange = (id: string, changes: Partial<RoadmapNodeDraft>) => {
//     setRoot((current) => ({
//       ...current,
//       ...changes,
//       children: updateNode(current.children, id, changes),
//     }));

//     if (root.id === id) {
//       setRoot((current) => ({ ...current, ...changes }));
//     }

//     setError("");
//   };

//   const handleAddChild = (parentId: string) => {
//     setRoot((current) => {
//       if (current.id === parentId) {
//         return {
//           ...current,
//           children: [...current.children, createNode()],
//         };
//       }

//       return {
//         ...current,
//         children: addChild(current.children, parentId),
//       };
//     });
//   };

//   const handleRemove = (id: string) => {
//     setRoot((current) => ({
//       ...current,
//       children: removeNode(current.children, id),
//     }));
//   };

//   const countNodes = (node: RoadmapNodeDraft): number =>
//     1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);

//   const handleSave = () => {
//     const validate = (node: RoadmapNodeDraft): boolean =>
//       Boolean(node.title.trim()) && node.children.every(validate);

//     if (!validate(root)) {
//       setError("Please enter a title for every node before saving.");
//       return;
//     }

//     setError("");
//     onSave?.(buildPayload(root, null));
//   };

//   return (
//     <div className="min-h-screen bg-[#101010] p-4 text-white sm:p-6">
//       <div className="mx-auto max-w-[1600px]">
//         {/* Page heading */}
//         <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-indigo-400">
//               Roadmap Studio
//             </div>
//             <h1 className="text-xl font-semibold tracking-tight">
//               Build your roadmap
//             </h1>
//             <p className="mt-1 text-xs text-gray-500">
//               Create a hierarchy of roadmaps and lists.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="rounded-lg border border-white/10 bg-[#181818] px-3 py-2">
//               <div className="text-[9px] text-gray-500">Total nodes</div>
//               <div className="text-sm font-semibold">{countNodes(root)}</div>
//             </div>

//             <button
//               type="button"
//               onClick={handleSave}
//               className="rounded-lg bg-indigo-500 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-indigo-600 active:scale-[0.98]"
//             >
//               Save roadmap →
//             </button>
//           </div>
//         </div>

//         {/* Canvas */}
//         <div className="overflow-x-auto rounded-xl border border-white/[0.07] bg-[#131313] p-4 sm:p-6">
//           <div className="mb-6 flex items-center gap-2 text-[10px] text-gray-500">
//             <span className="h-2 w-2 rounded-full bg-indigo-400" />
//             Root
//             <span className="mx-1 text-gray-700">/</span>
//             <span>Child nodes flow from left to right</span>
//           </div>

//           <div className="min-w-max pb-6">
//             <RoadmapNodeEditor
//               node={root}
//               parent={null}
//               depth={0}
//               isRoot
//               onChange={handleChange}
//               onAddChild={handleAddChild}
//               onRemove={handleRemove}
//             />
//           </div>
//         </div>

//         {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

//         <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-gray-500">
//           <span>
//             <span className="text-indigo-300">Roadmap</span> · Can contain
//             nested nodes
//           </span>
//           <span>
//             <span className="text-emerald-300">List</span> · A list-type node
//           </span>
//           <span>
//             Deleting a node also deletes its descendants from this draft.
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
