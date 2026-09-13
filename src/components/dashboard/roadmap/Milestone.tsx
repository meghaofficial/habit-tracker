import { FiTarget, FiCheck } from "react-icons/fi";

interface MilestoneProps {
  title: string;
  completedChildren: number;
  totalChildren: number;
}

const Milestone = ({
  title,
  completedChildren,
  totalChildren,
}: MilestoneProps) => {
  const progress =
    totalChildren > 0
      ? Math.round((completedChildren / totalChildren) * 100)
      : 0;

  const isCompleted = progress === 100;

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/2.5 p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-400/20 bg-indigo-500/10">
            {isCompleted ? (
              <FiCheck className="h-4 w-4 text-indigo-400" />
            ) : (
              <FiTarget className="h-4 w-4 text-indigo-400" />
            )}
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
              Milestone
            </p>

            <h3 className="text-sm font-semibold text-white">
              {title}
            </h3>
          </div>
        </div>

        {/* Percentage */}
        <span className="text-lg font-bold text-indigo-400">
          {progress}%
        </span>
      </div>

      {/* Progress */}
      <div className="relative">
        <div className="h-2 overflow-hidden rounded-full bg-white/6">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Milestone markers */}
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
          {[0, 25, 50, 75, 100].map((value) => (
            <div
              key={value}
              className={`h-3 w-3 rounded-full border-2 ${
                progress >= value
                  ? "border-indigo-400 bg-indigo-500"
                  : "border-white/20 bg-[#111118]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Marker labels */}
      <div className="mt-3 flex justify-between text-[9px] font-medium text-gray-600">
        <span>Start</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>Complete</span>
      </div>
    </div>
  );
};

export default Milestone;