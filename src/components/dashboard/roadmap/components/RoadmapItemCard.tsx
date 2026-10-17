import { Check, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface RoadmapItem {
  id: string;
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

const RoadmapItemCard = ({ roadmap }: { roadmap: RoadmapItem }) => {
  const navigate = useNavigate();

  const percentage = Math.round(
    (roadmap.completed_nodes_count / roadmap.total_nodes_count) * 100,
  );
  const completed =
    roadmap.completed_nodes_count === roadmap.total_nodes_count &&
    roadmap.total_nodes_count !== 0;

  return (
    <div>
      <article
        key={roadmap.id}
        className="group relative min-h-27 overflow-hidden rounded-xl border border-white/12 bg-[#191919] transition duration-200 hover:border-white/25 hover:bg-[#1d1d1d]"
        style={{
          borderLeftColor: roadmap.accent_color,
          borderLeftWidth: "2px",
        }}
      >
        <button
          type="button"
          // onClick={() => onSelectRoadmap?.(roadmap)}
          aria-label={`Open ${roadmap.title}`}
          className="flex min-h-27 w-full flex-col p-3 text-left"
        >
          {/* Header: Icon, Title, Chevron */}
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-[12px] leading-4">
              {completed ? (
                <Check size={13} style={{ color: roadmap.accent_color }} />
              ) : (
                roadmap.icon
              )}
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="min-w-0 text-[11px] font-semibold leading-normal text-gray-100 line-clamp-2">
                {roadmap.title}
              </h3>
              {roadmap.category && (
                <span className="mt-1 inline-block rounded-full border border-white/10 bg-white/5 px-1.5 py-0.2 text-[9px] font-medium text-gray-400">
                  {roadmap.category}
                </span>
              )}
            </div>

            <ChevronRight
              size={13}
              className="mt-0.5 shrink-0 text-gray-600 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              onClick={() => navigate(`/roadmap/${roadmap.title}`)}
            />
          </div>

          {/* Progress Information */}
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between gap-2 text-[9px] text-gray-500">
              <span>
                {roadmap.completed_nodes_count}/{roadmap.total_nodes_count}{" "}
                completed
              </span>
              <span
                className="font-semibold"
                style={{ color: roadmap.accent_color }}
              >
                {Number.isNaN(percentage) ? 0 : percentage}%
              </span>
            </div>

            <div className="mt-1.5 h-0.75 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Number.isNaN(percentage) ? 0 : percentage}%`,
                  backgroundColor: roadmap.accent_color,
                }}
              />
            </div>
          </div>
        </button>

        {/* Interactive toggle control for quick progress testing */}
        {/* <button
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
                  </button> */}
      </article>
    </div>
  );
};

export default RoadmapItemCard;
