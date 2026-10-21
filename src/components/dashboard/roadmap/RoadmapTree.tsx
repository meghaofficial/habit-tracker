import { useEffect, useState } from "react";
import type { RoadmapItem } from "./types";
import CreationForm from "./components/CreationForm";
import { ChevronRight, ChevronDown } from "lucide-react";
import IconPickerModal from "./components/IconPickerModal";
import { useParams } from "react-router-dom";
import { roadmapApi } from "../../../api/roadmap.api";

const DEFAULT_ACCENT = "#38bdf8";

export default function RoadmapTree() {
  const params = useParams();
  const [root, setRoot] = useState<RoadmapItem | null>(null);
  const [rootFormOpen, setRootFormOpen] = useState(true);
  const [openForms, setOpenForms] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const [selectedIcon, setSelectedIcon] = useState("🚀");
  const [childIcons, setChildIcons] = useState<Record<string, string>>({});
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [activeIconParentId, setActiveIconParentId] = useState<string | null>(
    null,
  );

  const toggleValue = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    id: string,
  ) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const addChildLocally = (
    node: RoadmapItem,
    child: RoadmapItem,
  ): RoadmapItem => ({
    ...node,
    nodes:
      node._id === child.parent_id
        ? [...node.nodes, child]
        : node.nodes.map((item) => addChildLocally(item, child)),
  });

  const createChild = (parent: RoadmapItem, child: RoadmapItem) => {
    const newNode: RoadmapItem = {
      ...child,
      icon: childIcons[parent._id] || "🚀",
      parent_id: parent._id,
      type: child.type ?? "roadmap",
      nodes: [],
    };

    setRoot((current) =>
      current ? addChildLocally(current, newNode) : current,
    );

    setChildIcons((prev) => {
      const updated = { ...prev };
      delete updated[parent._id];
      return updated;
    });

    setOpenForms((prev) => prev.filter((id) => id !== `new:${parent._id}`));

    setExpanded((prev) =>
      prev.includes(parent._id) ? prev : [...prev, parent._id],
    );
  };

  useEffect(() => {
    const fetchFullRoadmap = async () => {
      if (!params?.roadmapID) return;
      // setLoading(true);

      try {
        const response = await roadmapApi.getFullRoadmapByID(params?.roadmapID);

        if (response?.success) {
          const {
            _id,
            title,
            description,
            icon,
            total_nodes_count,
            completed_nodes_count,
            status,
            accent_color,
            category,
            nodes,
            type,
            parent_id,
            points,
          } = response?.roadmap;
          setRoot({
            _id,
            title,
            description,
            icon,
            total_nodes_count,
            completed_nodes_count,
            status,
            accent_color,
            category,
            type,
            parent_id,
            points,
            nodes,
          });
        }
      } catch (error) {
        console.error("Failed to fetch full roadmap:", error);
      } finally {
        // setLoading(false);
      }
    };

    void fetchFullRoadmap();
  }, [params]);

  const renderNode = (
    node: RoadmapItem,
    parent: RoadmapItem | null,
    depth: number,
  ): React.ReactNode => {
    const formOpen = openForms.includes(node._id);
    const isExpanded = expanded.includes(node._id);
    const accent = node.accent_color || DEFAULT_ACCENT;

    return (
      <div key={node._id} className="min-w-0">
        {/* Compact node card */}
        <article
          className="w-[min(100%,350px)] overflow-hidden rounded-xl border border-white/10 bg-[#1d1d1d] transition-colors"
          style={{
            borderLeft: `3px solid ${accent}`,
          }}
        >
          <div className="flex items-start gap-3 px-4 py-3.5">
            <span className="shrink-0 text-lg">{node.icon || "🚀"}</span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleValue(setOpenForms, node._id)}
                  className="block max-w-full truncate text-left text-[12px] font-semibold text-white hover:text-indigo-300"
                  title="Edit node"
                >
                  {node.title || "Untitled node"}
                </button>

                {node.category && (
                  <span className="inline-flex rounded-full border border-white/10 px-1 py-0.2 text-[10px] text-gray-400">
                    {node.category}
                  </span>
                )}
              </div>

              <div className="mt-2 text-[10px] text-gray-500">
                {node.completed_nodes_count ?? 0}/{node.total_nodes_count ?? 0}{" "}
                completed
              </div>

              <div className="mt-2 h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${
                      node.total_nodes_count
                        ? Math.min(
                            100,
                            (node.completed_nodes_count /
                              node.total_nodes_count) *
                              100,
                          )
                        : 0
                    }%`,
                    backgroundColor: accent,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleValue(setExpanded, node._id)}
              aria-label={isExpanded ? "Collapse children" : "Expand children"}
              className="shrink-0 rounded-md p-1.5 text-gray-300 hover:bg-white/10"
            >
              <span className="text-lg">
                {isExpanded ? (
                  <ChevronDown size={13} />
                ) : (
                  <ChevronRight size={13} />
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggleValue(setOpenForms, node._id)}
              aria-label={formOpen ? "Close form" : "Edit node"}
              className={`shrink-0 rounded-md py-0.5 px-1.5 text-sm ${
                formOpen
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-gray-500 hover:bg-white/10 hover:text-white"
              }`}
            >
              {formOpen ? "×" : "⋮"}
            </button>
          </div>

          {/* Form visible only when toggled */}
          {formOpen && (
            <div className="border-t border-white/10 p-3">
              <CreationForm
                key={node._id}
                parentId={parent?._id ?? null}
                parentName={parent?.title ?? null}
                initialData={node}
                onCreated={(updated) => {
                  setRoot((current) => {
                    if (!current) return current;

                    const update = (item: RoadmapItem): RoadmapItem => ({
                      ...item,
                      ...(item._id === updated._id ? updated : {}),
                      nodes: item.nodes.map(update),
                    });

                    return update(current);
                  });

                  setOpenForms((prev) => prev.filter((id) => id !== node._id));
                }}
                onCancel={() =>
                  setOpenForms((prev) => prev.filter((id) => id !== node._id))
                }
                // onOpenIconPicker={() => setIconPickerOpen(true)}
                selectedIcon={node.icon || "🚀"}
                // onIconChange={(icon) => {
                //   setRoot((current) => {
                //     if (!current) return current;

                //     const update = (item: RoadmapItem): RoadmapItem => ({
                //       ...item,
                //       ...(item._id === node._id ? { icon } : {}),
                //       children: item.children.map(update),
                //     });

                //     return update(current);
                //   });
                // }}
              />
            </div>
          )}

          {/* Add child */}
          <div className="flex items-center justify-between border-t border-white/6 px-4 py-2">
            <span className="text-[10px] text-gray-500">
              {node?.nodes?.length || 0} child
              {(node?.nodes?.length || 0) !== 1 ? "ren" : ""}
            </span>

            <button
              type="button"
              onClick={() => toggleValue(setOpenForms, `new:${node._id}`)}
              className="rounded-md text-[11px] text-indigo-300 hover:bg-indigo-500/10"
            >
              + Add child
            </button>
          </div>
        </article>

        {/* New child form */}
        {openForms.includes(`new:${node._id}`) && (
          <div className="mt-2 w-[min(100%,405px)] rounded-xl border border-indigo-500/20 bg-[#171717] p-3">
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveIconParentId(node._id);
                  setIconPickerOpen(true);
                }}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xl hover:bg-white/10"
                title="Choose child icon"
              >
                {childIcons[node._id] || "🚀"}
              </button>

              <span className="text-xs text-gray-400">Choose child icon</span>
            </div>

            <CreationForm
              key={node._id}
              parentId={node._id}
              parentName={node.title}
              onCreated={(child) => createChild(node, child)}
              onCancel={() =>
                setOpenForms((prev) =>
                  prev.filter((id) => id !== `new:${node._id}`),
                )
              }
              selectedIcon={childIcons[node._id] || "🚀"}
            />
          </div>
        )}

        {/* Nested children, sequentially */}
        {isExpanded && node.nodes.length > 0 && (
          <div className="ml-4 mt-3 space-y-4 border-l border-white/10 pl-4 sm:ml-6 sm:pl-5">
            {node.nodes.map((child) => (
              <div key={child._id} className="relative">
                <div className="absolute -left-4 top-5 w-4 border-t border-white/10 sm:-left-5 sm:w-5" />
                {renderNode(child, node, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative bg-[#111111] p-4 text-white">
      <div className="w-full">
        {root && (
          <div className="flex items-center justify-between gap-3 absolute right-0 -top-18">
            <button
              type="button"
              onClick={() =>
                setExpanded((prev) =>
                  prev.includes(root._id)
                    ? prev.filter((id) => id !== root._id)
                    : [...prev, root._id],
                )
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 "
            >
              {expanded.includes(root._id)
                ? "Collapse children"
                : "Expand children"}
            </button>
          </div>
        )}

        {!root ? (
          <div className="max-w-101.25 rounded-2xl border border-white/10 bg-[#1d1d1d] p-4">
            <div className="mb-3 text-sm font-medium">
              <span
                className="text-lg cursor-pointer"
                onClick={() => setIconPickerOpen(true)}
              >
                {selectedIcon || "🚀"}
              </span>
              <span className="ml-1">Create root node</span>
            </div>

            {rootFormOpen && (
              <CreationForm
                parentId={null}
                parentName={null}
                selectedIcon={selectedIcon}
                onCreated={(item) => {
                  setRoot({
                    ...item,
                    icon: selectedIcon,
                    type: item.type ?? "roadmap",
                    nodes: [],
                  });
                  setRootFormOpen(false);
                }}
                onCancel={() => setRootFormOpen(false)}
              />
            )}
            {!rootFormOpen && (
              <button
                type="button"
                onClick={() => setRootFormOpen(true)}
                className="text-xs text-indigo-300"
              >
                + Open root form
              </button>
            )}
          </div>
        ) : (
          renderNode(root, null, 0)
        )}

        {iconPickerOpen && (
          <IconPickerModal
            selectedIcon={
              activeIconParentId === null
                ? selectedIcon
                : childIcons[activeIconParentId] || "🚀"
            }
            onSelect={(icon) => {
              if (activeIconParentId === null) {
                setSelectedIcon(icon);
              } else {
                setChildIcons((prev) => ({
                  ...prev,
                  [activeIconParentId]: icon,
                }));
              }

              setIconPickerOpen(false);
              setActiveIconParentId(null);
            }}
            onClose={() => {
              setIconPickerOpen(false);
              setActiveIconParentId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
