import { FiActivity, FiCheck, FiMinus } from "react-icons/fi";
import RadialProgress from "../../charts/RadialProgress";
import Card from "../../shared/Card";
import type { DashboardI } from "../../../types";
import { monMap } from "../../../staticData";

interface PerformanceSummaryProps {
  selectedMonth: DashboardI;
  monthDashID: string;
}

const PerformanceSummary = ({ selectedMonth }: PerformanceSummaryProps) => {
  const completed = selectedMonth.totalCount ?? 0;
  const totalPossible =
    (selectedMonth.totalDays ?? 0) * (selectedMonth.totalTasks ?? 0);

  const missed = Math.max(0, totalPossible - completed);
  const percentage = Math.min(
    100,
    Math.max(0, Number(selectedMonth.progress) || 0),
  );

  // Retains your existing month mapping.
  const monthName = monMap[selectedMonth.month - 1] || "";

  const summary =
    totalPossible === 0
      ? "No activity recorded"
      : percentage === 100
        ? "Every habit, every day."
        : percentage >= 75
          ? "A month of strong consistency."
          : percentage >= 50
            ? "Progress worth building on."
            : percentage > 0
              ? "Every completed habit counts."
              : "A month to reflect on.";

  return (
    <Card heading="" cardWidth="w-full">
      <div className="relative overflow-hidden rounded-xl p-1">
        <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-indigo-500/5 blur-3xl" />

        {/* Header */}
        <div className="relative mb-5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FiActivity size={13} className="text-indigo-400" />
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Performance Summary
            </h3>
          </div>

          <span className="rounded-md border border-white/8 bg-white/3 px-2 py-1 text-[9px] font-medium text-gray-400">
            {monthName} {selectedMonth.year}
          </span>
        </div>

        {/* Ring and report */}
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center justify-center rounded-2xl border border-indigo-400/10 bg-indigo-500/3 px-6 py-4">
            <RadialProgress
              progress={String(percentage)}
              monthName={monthName}
              compact
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-200">{summary}</p>

            <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
              {completed} of {totalPossible} habit check-ins completed
            </p>

            {/* Proportional completion bar */}
            <div
              aria-hidden="true"
              className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-white/6"
            >
              <div
                className="h-full rounded-full bg-emerald-400/80 transition-[width] duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Compact metrics */}
            <div className="mt-4 flex items-center">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/15 bg-emerald-500/8 text-emerald-400">
                  <FiCheck size={14} />
                </span>

                <div>
                  <p className="text-base font-bold leading-tight text-white tabular-nums">
                    {completed}
                  </p>
                  <p className="mt-0.5 text-[9px] text-gray-500">Done</p>
                </div>
              </div>

              <div className="mx-3 h-8 w-px bg-white/8" />

              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-gray-500">
                  <FiMinus size={14} />
                </span>

                <div>
                  <p className="text-base font-bold leading-tight text-gray-300 tabular-nums">
                    {missed}
                  </p>
                  <p className="mt-0.5 text-[9px] text-gray-500">Skipped</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Context */}
        <div className="relative mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/6 pt-3">
          <span className="text-[10px] text-gray-500">
            {selectedMonth.totalTasks} habits tracked
          </span>
          <span className="text-[10px] text-gray-500">
            Across {selectedMonth.totalDays} days
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceSummary;
