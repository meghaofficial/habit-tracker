import { useEffect, useState } from "react";
import type { ListPoint, RoadmapItem } from "../types";
import { notify } from "../../../../helper";
import { roadmapApi } from "../../../../api/roadmap.api";
import { DEFAULT_COLORS } from "../testData";
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

  selectedIcon: string;
  onOpenIconPicker: () => void;
};

const CreationForm = ({
  parentId,
  parentName,
  initialData,
  onCreated,
  onCancel,
  selectedIcon,
  onOpenIconPicker,
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
    parent_id: null,
    points: [],
    ...initialData,
  });

  const points = roadmapConfig.points ?? [];

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
        type: roadmapConfig.type,
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
    setRoadmapConfig((prev) => ({
      ...prev,
      points: nextPoints,
    }));

    // Call your future API here.
    // await roadmapApi.updateListPoints(...);
  };

  const addPoint = () => {
    const nextPoints = [
      ...points,
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
      .map((point, order) => ({ ...point, order }));

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

    void handlePointsChange(
      nextPoints.map((point, order) => ({ ...point, order })),
      "reorder",
    );
  };

  useEffect(() => {
    setRoadmapConfig((prev) => ({
      ...prev,
      icon: selectedIcon,
    }));
  }, [selectedIcon]);

  console.log("roadmapco", roadmapConfig);

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

      {/* Node Type */}
      <div>
        <label className="mb-1.5 block text-[11px] font-medium text-gray-300">
          Node Type
        </label>

        <div className="flex gap-2">
          {(["roadmap", "list"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setRoadmapConfig((prev) => ({ ...prev, type: value }))
              }
              className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition ${
                value === roadmapConfig.type
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                  : "border-white/10 bg-[#1e1e1e] text-gray-400 hover:bg-white/5"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Ordered List Points */}
      {roadmapConfig.type === "list" && (
        <div className="rounded-xl border border-white/10 bg-[#191919] p-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-gray-200">
                List Sequence
              </h3>
              <p className="mt-1 text-[10px] text-gray-500">
                Add points in the order they should be completed.
              </p>
            </div>

            <span className="rounded-md bg-white/6 px-2 py-1 text-[10px] text-gray-400">
              {points.length} points
            </span>
          </div>

          <div className="space-y-2">
            {points.map((point, index) => (
              <div
                key={point.id}
                className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#202020] px-2 py-1"
              >
                {/* Sequence number */}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/6 text-[10px] font-medium text-gray-400">
                  {index + 1}
                </span>

                {/* Editable point */}
                <input
                  value={point.text}
                  onChange={(e) => updatePoint(point.id, e.target.value)}
                  placeholder={`Enter point ${index + 1}...`}
                  className="min-w-0 flex-1 bg-transparent py-1 text-xs text-white outline-none placeholder:text-gray-600"
                />

                {/* Reorder and delete */}
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => movePoint(index, -1)}
                    aria-label="Move point up"
                    className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white disabled:opacity-20"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={index === points.length - 1}
                    onClick={() => movePoint(index, 1)}
                    aria-label="Move point down"
                    className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white disabled:opacity-20"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => deletePoint(point.id)}
                    aria-label="Delete point"
                    className="rounded p-1 text-gray-500 hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            {points.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/10 px-3 py-5 text-center">
                <p className="text-xs text-gray-400">No points added yet</p>
                <p className="mt-1 text-[10px] text-gray-600">
                  Start by adding your first point.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={addPoint}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-500/30 py-2 text-xs text-indigo-300 transition hover:border-indigo-500/60 hover:bg-indigo-500/6"
          >
            <span className="text-sm">+</span>
            Add point
          </button>
        </div>
      )}

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
