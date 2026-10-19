import { useState } from "react";
import {
  Check,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface RoadmapItemCardProps {
  roadmap: RoadmapItem;
  onEdit?: (roadmap: RoadmapItem) => void;
  deleteRoadmap: (id: string) => void;
  isDeleting: boolean;
}

const RoadmapItemCard = ({
  roadmap,
  onEdit,
  deleteRoadmap,
  isDeleting,
}: RoadmapItemCardProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const percentage =
    roadmap.total_nodes_count > 0
      ? Math.min(
          100,
          Math.round(
            (roadmap.completed_nodes_count / roadmap.total_nodes_count) * 100,
          ),
        )
      : 0;

  const completed =
    roadmap.total_nodes_count > 0 &&
    roadmap.completed_nodes_count >= roadmap.total_nodes_count;

  const enterRoadmap = () => {
    navigate(`/roadmap/${roadmap._id}`);
  };

  const handleDelete = async () => {
    setMenuOpen(false);

    if (
      !window.confirm(
        `Delete "${roadmap.title}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    await deleteRoadmap(roadmap._id);
  };

  return (
    <article
      className={`group relative min-h-30 overflow-visible rounded-xl border border-white/12 bg-[#191919] transition duration-200 ${!isDeleting && "hover:border-white/25 hover:bg-[#1d1d1d]"}`}
      style={{
        borderLeftColor: roadmap.accent_color,
        borderLeftWidth: "2px",
      }}
    >
      {isDeleting && (
        <div className="h-full w-full absolute bg-black/50 rounded-xl z-999"></div>
      )}

      {/* Enter roadmap */}
      <button
        type="button"
        onClick={enterRoadmap}
        aria-label={`Enter ${roadmap.title}`}
        className="flex min-h-27 w-full flex-col p-3 pr-10 text-left"
      >
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-[12px] leading-4">
            {completed ? (
              <Check size={13} style={{ color: roadmap.accent_color }} />
            ) : (
              roadmap.icon
            )}
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-[11px] font-semibold leading-normal text-gray-100">
              {roadmap.title}
            </h3>

            {roadmap.category && (
              <span className="mt-1 inline-block rounded-full border border-white/10 bg-white/5 px-1.5 py-0.2 text-[9px] font-medium text-gray-400">
                {roadmap.category}
              </span>
            )}
            {roadmap.description && (
              <span className="w-[80%] absolute line-clamp-1 text-[9px] mt-2 font-medium text-gray-500">
                {roadmap.description}
              </span>
            )}
          </div>

          {!isDeleting && (
            <ChevronRight
              size={13}
              className="mt-0.5 shrink-0 text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-gray-300"
            />
          )}
        </div>

        {/* Progress */}
        <div className="mt-auto w-[85%] pt-4 absolute bottom-4 left-5">
          <div className="flex items-center justify-between gap-2 text-[9px] text-gray-500">
            <span>
              {roadmap.completed_nodes_count}/{roadmap.total_nodes_count}{" "}
              completed
            </span>

            <span
              className="font-semibold"
              style={{ color: roadmap.accent_color }}
            >
              {percentage}%
            </span>
          </div>

          <div className="mt-1.5 h-0.75 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${percentage}%`,
                backgroundColor: roadmap.accent_color,
              }}
            />
          </div>
        </div>
      </button>

      {/* Actions menu */}
      <div className="absolute right-2 top-2 z-20">
        <button
          type="button"
          aria-label={`Actions for ${roadmap.title}`}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-md p-1 text-gray-500 transition hover:bg-white/10 hover:text-white"
        >
          <MoreVertical size={15} />
        </button>

        {menuOpen && (
          <>
            {/* Close menu when clicking outside */}
            <button
              type="button"
              aria-label="Close actions menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[-1] cursor-default"
            />

            <div className="absolute right-0 top-7 w-32 overflow-hidden rounded-lg border border-white/10 bg-[#222222] p-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  enterRoadmap();
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[11px] text-gray-300 transition hover:bg-white/8 hover:text-white"
              >
                <ExternalLink size={12} />
                Enter
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.(roadmap);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[11px] text-gray-300 transition hover:bg-white/8 hover:text-white"
              >
                <Pencil size={12} />
                Edit
              </button>

              <div className="my-1 border-t border-white/8" />

              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[11px] text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
};

export default RoadmapItemCard;
