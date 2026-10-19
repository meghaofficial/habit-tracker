import { useState } from "react";
import type { RoadmapItem } from "./types";
import CreationForm from "./components/CreationForm";
import { ChevronRight, ChevronDown } from "lucide-react";

type TreeNode = RoadmapItem & {
  parent_id?: string | null;
  type?: "roadmap" | "list";
  nodes?: string[];
  children: TreeNode[];
};

const DEFAULT_ACCENT = "#38bdf8";

export default function RoadmapTree() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [rootFormOpen, setRootFormOpen] = useState(true);
  const [openForms, setOpenForms] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleValue = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    id: string,
  ) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const addChildLocally = (node: TreeNode, child: TreeNode): TreeNode => ({
    ...node,
    children:
      node._id === child.parent_id
        ? [...node.children, child]
        : node.children.map((item) => addChildLocally(item, child)),
  });

  const createChild = (parent: TreeNode, child: RoadmapItem) => {
    const newNode: TreeNode = {
      ...child,
      parent_id: parent._id,
      type: child.type ?? "roadmap",
      children: [],
    };

    setRoot((current) =>
      current ? addChildLocally(current, newNode) : current,
    );

    setOpenForms((prev) => prev.filter((id) => id !== parent._id));
    setExpanded((prev) =>
      prev.includes(parent._id) ? prev : [...prev, parent._id],
    );
  };

  const renderNode = (
    node: TreeNode,
    parent: TreeNode | null,
    depth: number,
  ): React.ReactNode => {
    const formOpen = openForms.includes(node._id);
    const isExpanded = expanded.includes(node._id);
    const accent = node.accent_color || DEFAULT_ACCENT;

    return (
      <div key={node._id} className="min-w-0">
        {/* Compact node card */}
        <article
          className="w-[min(100%,405px)] overflow-hidden rounded-2xl border border-white/10 bg-[#1d1d1d] transition-colors"
          style={{
            borderLeft: `3px solid ${accent}`,
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="shrink-0 text-lg">{node.icon || "🗺️"}</span>

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => toggleValue(setOpenForms, node._id)}
                className="block max-w-full truncate text-left text-sm font-semibold text-white hover:text-indigo-300"
                title="Edit node"
              >
                {node.title || "Untitled node"}
              </button>

              {node.category && (
                <span className="mt-1 inline-flex rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-gray-400">
                  {node.category}
                </span>
              )}

              {node.description && (
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                  {node.description}
                </p>
              )}

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
              className={`shrink-0 rounded-md p-1.5 text-sm ${
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

                    const update = (item: TreeNode): TreeNode => ({
                      ...item,
                      ...(item._id === updated._id ? updated : {}),
                      children: item.children.map(update),
                    });

                    return update(current);
                  });

                  setOpenForms((prev) => prev.filter((id) => id !== node._id));
                }}
                onCancel={() =>
                  setOpenForms((prev) => prev.filter((id) => id !== node._id))
                }
              />
            </div>
          )}

          {/* Add child */}
          <div className="flex items-center justify-between border-t border-white/6 px-4 py-2">
            <span className="text-[10px] text-gray-500">
              {node.children.length} child
              {node.children.length !== 1 ? "ren" : ""}
            </span>

            <button
              type="button"
              onClick={() => toggleValue(setOpenForms, `new:${node._id}`)}
              className="rounded-md px-2 py-1 text-[11px] text-indigo-300 hover:bg-indigo-500/10"
            >
              + Add child
            </button>
          </div>
        </article>

        {/* New child form */}
        {openForms.includes(`new:${node._id}`) && (
          <div className="mt-2 w-[min(100%,405px)] rounded-xl border border-indigo-500/20 bg-[#171717] p-3">
            <CreationForm
              parentId={node._id}
              parentName={node.title}
              onCreated={(child) => createChild(node, child)}
              onCancel={() =>
                setOpenForms((prev) =>
                  prev.filter((id) => id !== `new:${node._id}`),
                )
              }
            />
          </div>
        )}

        {/* Nested children, sequentially */}
        {isExpanded && node.children.length > 0 && (
          <div className="ml-4 mt-3 space-y-4 border-l border-white/10 pl-4 sm:ml-6 sm:pl-5">
            {node.children.map((child) => (
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
    <div className="min-h-screen bg-[#111111] p-4 text-white sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Roadmap Builder</h1>
            <p className="mt-1 text-xs text-gray-500">
              Create nested roadmaps and lists.
            </p>
          </div>

          {root && (
            <button
              type="button"
              onClick={() =>
                setExpanded((prev) =>
                  prev.includes(root._id)
                    ? prev.filter((id) => id !== root._id)
                    : [...prev, root._id],
                )
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
            >
              {expanded.includes(root._id)
                ? "Collapse children"
                : "Expand children"}
            </button>
          )}
        </div>

        {!root ? (
          <div className="max-w-101.25 rounded-2xl border border-white/10 border-l-[3px] border-l-sky-400 bg-[#1d1d1d] p-4">
            <h2 className="mb-3 text-sm font-medium">Create root node</h2>
            {rootFormOpen && (
              <CreationForm
                parentId={null}
                parentName={null}
                onCreated={(item) => {
                  setRoot({
                    ...item,
                    type: item.type ?? "roadmap",
                    children: [],
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
      </div>
    </div>
  );
}
