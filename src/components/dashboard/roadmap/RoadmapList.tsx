import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Circle,
  Plus,
  Search,
  X,
  RotateCcw,
} from "lucide-react";
import { initialRoadmaps, type RoadmapItem } from "./testData";
import { useNavigate } from "react-router-dom";

export type RoadmapListProps = {
  roadmaps?: RoadmapItem[];
  onSelectRoadmap?: (roadmap: RoadmapItem) => void;
  onAddNewRoadmap?: () => void;
};

export default function RoadmapList({
  roadmaps: externalRoadmaps,
  onSelectRoadmap,
  onAddNewRoadmap,
}: RoadmapListProps) {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>(
    externalRoadmaps || initialRoadmaps,
  );
  const [search, setSearch] = useState("");
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract categories for optional filter tabs
  const categories = useMemo(() => {
    const set = new Set<string>();
    roadmaps.slice(0, 5).forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return ["all", ...Array.from(set)];
  }, [roadmaps]);

  // Overall totals and statistics
  const totals = useMemo(() => {
    let completedSteps = 0;
    let totalSteps = 0;
    let completedRoadmapsCount = 0;

    roadmaps.forEach((item) => {
      completedSteps += item.completedProblems;
      totalSteps += item.totalProblems;
      if (item.completedProblems === item.totalProblems) {
        completedRoadmapsCount += 1;
      }
    });

    const percentage =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return {
      completedSteps,
      totalSteps,
      completedRoadmapsCount,
      totalRoadmaps: roadmaps.length,
      percentage,
    };
  }, [roadmaps]);

  // Filtered roadmaps according to search query, completed filter, and category
  const visibleRoadmaps = useMemo(() => {
    const query = search.trim().toLowerCase();

    return roadmaps.filter((roadmap) => {
      const matchesSearch =
        !query ||
        roadmap.title.toLowerCase().includes(query) ||
        roadmap.description.toLowerCase().includes(query) ||
        roadmap.category.toLowerCase().includes(query);

      const isCompleted = roadmap.completedProblems === roadmap.totalProblems;
      const matchesCompleted = !showCompletedOnly || isCompleted;

      const matchesCategory =
        selectedCategory === "all" || roadmap.category === selectedCategory;

      return matchesSearch && matchesCompleted && matchesCategory;
    });
  }, [roadmaps, search, showCompletedOnly, selectedCategory]);

  // Quick increment/toggle helper for testing progress interactively
  const updateProgress = (id: string, delta: number) => {
    setRoadmaps((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextCompleted = Math.max(
          0,
          Math.min(item.totalProblems, item.completedProblems + delta),
        );
        return {
          ...item,
          completedProblems: nextCompleted,
        };
      }),
    );
  };

  const resetFilters = () => {
    setSearch("");
    setShowCompletedOnly(false);
    setSelectedCategory("all");
  };

  return (
    <div className="w-full text-white rounded-2xl my-4 border border-white/10 bg-black/20">
      <div className="mx-auto w-full py-6 px-8">
        {/* Header section */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Learning Roadmaps
              </h1>
              <span className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-400">
                {visibleRoadmaps.length} available
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-gray-400">
              Build your own custom learning roadmap to map out core skills and
              clear milestones tailored to your goals.
            </p>
          </div>

          {onAddNewRoadmap && (
            <button
              type="button"
              onClick={onAddNewRoadmap}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition active:scale-95 sm:self-auto cursor-pointer"
            >
              <Plus size={15} />
              <span>Create Roadmap</span>
            </button>
          )}
        </header>

        <div className="flex items-center justify-between flex-row-reverse mt-3">
          {/* Search bar and filter controls */}
          <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search bar */}
            <div className="relative max-w-sm flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a roadmap..."
                aria-label="Search roadmaps"
                className="w-full rounded-lg border border-white/10 bg-[#111111] py-2 pl-9 pr-8 text-xs text-white outline-none placeholder:text-gray-600 focus:border-white/25 transition duration-150"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-500 hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Completed only button matching RoadmapsPage.tsx reference */}
            <button
              type="button"
              onClick={() => setShowCompletedOnly((value) => !value)}
              aria-pressed={showCompletedOnly}
              className={`inline-flex items-center justify-center gap-2 self-start rounded-lg border px-3 py-2 text-xs transition duration-150 sm:self-auto ${
                showCompletedOnly
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium"
                  : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Check size={14} />
              Completed only
            </button>
          </section>

          {/* Category Pills (Horizontal scrollable) */}
          <section className="mt-3 flex items-center gap-1.5 overflow-x-auto max-w-160 pb-1 text-xs">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const label = category === "all" ? "All Roadmaps" : category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                    isSelected
                      ? "bg-white/15 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </section>
        </div>

        {/* Roadmap Cards Grid matching RoadmapsPage.tsx dimensions and look */}
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleRoadmaps.map((roadmap) => {
              const percentage = Math.round(
                (roadmap.completedProblems / roadmap.totalProblems) * 100,
              );
              const completed =
                roadmap.completedProblems === roadmap.totalProblems;

              return (
                <article
                  key={roadmap.id}
                  className="group relative min-h-27 overflow-hidden rounded-xl border border-white/12 bg-[#191919] transition duration-200 hover:border-white/25 hover:bg-[#1d1d1d]"
                  style={{
                    borderLeftColor: roadmap.color,
                    borderLeftWidth: "2px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelectRoadmap?.(roadmap)}
                    aria-label={`Open ${roadmap.title}`}
                    className="flex min-h-27 w-full flex-col p-3 text-left"
                  >
                    {/* Header: Icon, Title, Chevron */}
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-[12px] leading-4">
                        {completed ? (
                          <Check size={13} style={{ color: roadmap.color }} />
                        ) : (
                          roadmap.icon
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="min-w-0 text-[11px] font-semibold leading-normal text-gray-100 line-clamp-2">
                          {roadmap.title}
                        </h3>
                        {roadmap.badge && (
                          <span className="mt-1 inline-block rounded-full border border-white/10 bg-white/5 px-1.5 py-0.2 text-[9px] font-medium text-gray-400">
                            {roadmap.badge}
                          </span>
                        )}
                      </div>

                      <ChevronRight
                        size={13}
                        className="mt-0.5 shrink-0 text-gray-600 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                        onClick={() =>
                          navigate(
                            `/roadmap/${roadmap.title.toLocaleLowerCase()}`,
                          )
                        }
                      />
                    </div>

                    {/* Progress Information */}
                    <div className="mt-auto pt-4">
                      <div className="flex items-center justify-between gap-2 text-[9px] text-gray-500">
                        <span>
                          {roadmap.completedProblems}/{roadmap.totalProblems}{" "}
                          completed
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: roadmap.color }}
                        >
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: roadmap.color,
                          }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Interactive toggle control for quick progress testing */}
                  <button
                    type="button"
                    title={completed ? "Undo last step" : "Complete one step"}
                    aria-label={
                      completed
                        ? `Undo completion for ${roadmap.title}`
                        : `Complete one step for ${roadmap.title}`
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      updateProgress(roadmap.id, completed ? -1 : 1);
                    }}
                    className="absolute bottom-2 right-2 rounded-md p-1 text-gray-600 opacity-0 transition hover:bg-white/10 hover:text-white focus:opacity-100 group-hover:opacity-100"
                  >
                    {completed ? <Circle size={12} /> : <Check size={12} />}
                  </button>
                </article>
              );
            })}
          </div>

          {/* Empty state matching RoadmapsPage.tsx */}
          {visibleRoadmaps.length === 0 && (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 px-5 py-16 text-center">
              <Search size={24} className="text-gray-500" />
              <h3 className="mt-3 text-sm font-semibold text-gray-200">
                No matching roadmaps found
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {showCompletedOnly
                  ? "No completed roadmaps match your search query."
                  : "Try a different search query or clear your active filters."}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <RotateCcw size={13} />
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Footer info matching reference */}
        <footer className="mt-8 border-t border-white/[0.08] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-500">
            <span>
              {totals.completedSteps} of {totals.totalSteps} steps completed
              across {totals.totalRoadmaps} roadmaps
            </span>
            <span>Continuous learning builds mastery.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
