import { useEffect, useRef, useState } from "react";
import { Check, Plus, Search, X, RotateCcw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { roadmapApi } from "../../../api/roadmap.api";
import RoadmapItemCard from "./components/RoadmapItemCard";
import { notify } from "../../../helper";
import Pagination from "../../shared/Pagination";

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
}

export type RoadmapListProps = {
  onAddNewRoadmap?: () => void;
};

export default function RoadmapList({ onAddNewRoadmap }: RoadmapListProps) {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(() =>
    Math.max(1, Number(searchParams.get("page")) || 1),
  );
  const [totalPages, setTotalPages] = useState(0);
  const pageLimit = 8;
  const [categories, setCategories] = useState<string[]>([]);

  const isFirstRender = useRef(true);

  const updateSearch = (value: string) => {
    setSearch(value);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    setCurrentPage(1);
    setSearchParams(params);
  };

  const updatePage = (newPage: number) => {
    setCurrentPage(newPage);

    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));

    setSearchParams(params);
  };

  const resetFilters = () => {
    updateSearch("");
    setShowCompletedOnly(false);
    setSelectedCategory("");
  };

  const fetchRoadmaps = async (searchValue = "") => {
    setLoading(true);
    try {
      interface RoadmapListParams {
        search: string;
        page: number;
        limit: number;
        completed?: boolean;
      }

      const params: RoadmapListParams = {
        search: searchValue.trim(),
        page: currentPage,
        limit: pageLimit,
      };

      if (showCompletedOnly) {
        params.completed = true;
      }

      const data = await roadmapApi.getList(params);

      setRoadmaps(data?.data ?? []);
      setTotalPages(data?.pagination?.totalPages);
    } catch (error) {
      console.error("Failed to load roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await roadmapApi.getRoadmapCategories();
      if (data?.success) {
        if (data?.categories?.length > 0) {
          setCategories(["All", ...data?.categories]);
        } else {
          setCategories([]);
        }
      }
    } catch (error) {
      console.error("Failed to load roadmaps:", error);
    } finally {
      // setLoading(false);
    }
  };

  const deleteRoadmap = async (id: string) => {
    try {
      setIsDeleting(true);
      await roadmapApi.delete(id);
      notify.success("Roadmap deleted successfully.");
      await fetchRoadmaps();
      await fetchCategories();
    } catch (error) {
      console.error("Failed to delete roadmap:", error);
      notify.error("Could not delete the roadmap. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchRoadmaps(search);
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(() => {
      fetchRoadmaps(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, currentPage, showCompletedOnly]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
                {roadmaps.length} available
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
              onClick={() => {
                onAddNewRoadmap();
                navigate("/roadmap/create");
              }}
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
                onChange={(e) => {
                  updateSearch(e.target.value);
                  setSelectedCategory("");
                }}
                placeholder="Find a roadmap..."
                aria-label="Search roadmaps"
                className="w-full rounded-lg border border-white/10 bg-[#111111] py-2 pl-9 pr-8 text-xs text-white outline-none placeholder:text-gray-600 focus:border-white/25 transition duration-150"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => updateSearch("")}
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
              onClick={() => {
                setShowCompletedOnly((value) => !value);
              }}
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
              const isSelected =
                category === "All"
                  ? selectedCategory === ""
                  : selectedCategory === category;
              const label = category === "all" ? "All Roadmaps" : category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    if (category === "All") {
                      setSelectedCategory("");
                      setSearch("");
                    } else {
                      setSelectedCategory(category);
                      setSearch(category);
                    }
                  }}
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
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  className="w-full h-30 bg-white/5 rounded-xl animate-pulse"
                  key={index}
                ></div>
              ))
            ) : (
              <>
                {roadmaps.map((roadmap) => (
                  <RoadmapItemCard
                    roadmap={roadmap}
                    deleteRoadmap={deleteRoadmap}
                    isDeleting={isDeleting}
                  />
                ))}
              </>
            )}
          </div>

          {/* Empty state matching RoadmapsPage.tsx */}
          {roadmaps.length === 0 && (
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

        <div className="my-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={updatePage}
          />
        </div>

        {/* Footer info matching reference */}
        <footer className="border-t border-white/8 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-500">
            <span>
              {/* {totals.completedSteps} of {totals.totalSteps} steps completed
              across {totals.totalRoadmaps} roadmaps */}
            </span>
            <span>Continuous learning builds mastery.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
