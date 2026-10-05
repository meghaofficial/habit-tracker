import { useEffect, useState } from "react";
import { FiCheck, FiLock, FiTarget } from "react-icons/fi";
import { axiosPrivate } from "../../../api/axios";
import Container from "../../utils/Container";

type TargetType = "monthly" | "weekly" | "daily";

interface HistoryTarget {
  _id: string;
  value: string;
  completed: boolean;
}

interface TargetGroup {
  _id: string;
  monthDashID?: string;
  week?: number;
  dateNo?: number;
  targets: HistoryTarget[];
}

interface TargetsResponse {
  success: boolean;
  target?: TargetGroup | TargetGroup[] | null;
}

type TargetGroups = Record<TargetType, TargetGroup[]>;
type TargetErrors = Partial<Record<TargetType, string>>;

const tabs: { key: TargetType; label: string }[] = [
  { key: "monthly", label: "Monthly" },
  { key: "weekly", label: "Weekly" },
  { key: "daily", label: "Daily" },
];

const createEmptyGroups = (): TargetGroups => ({
  monthly: [],
  weekly: [],
  daily: [],
});

const TargetHistory = ({ monthDashID }: { monthDashID: string }) => {
  const [activeTab, setActiveTab] = useState<TargetType>("monthly");
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<TargetGroups>(createEmptyGroups);
  const [errors, setErrors] = useState<TargetErrors>({});

  useEffect(() => {
    let cancelled = false;

    setGroups(createEmptyGroups());
    setErrors({});

    if (!monthDashID) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchTargets = async () => {
      const results = await Promise.allSettled(
        tabs.map(async ({ key }) => {
          const { data } = await axiosPrivate.get<TargetsResponse>(
            `/api/${key}-targets`,
            {
              params: { monthDashID },
            },
          );

          if (!data.success) {
            throw new Error(`Unable to load ${key} targets`);
          }

          // Monthly: single group. Weekly/daily: array of groups.
          const records = data.target
            ? Array.isArray(data.target)
              ? data.target
              : [data.target]
            : [];

          return records
            .map((group) => ({
              ...group,
              targets: group.targets ?? [],
            }))
            .sort((a, b) => {
              if (key === "weekly") {
                return (a.week ?? 0) - (b.week ?? 0);
              }

              if (key === "daily") {
                return (a.dateNo ?? 0) - (b.dateNo ?? 0);
              }

              return 0;
            });
        }),
      );

      if (cancelled) return;

      const nextGroups = createEmptyGroups();
      const nextErrors: TargetErrors = {};

      results.forEach((result, index) => {
        const type = tabs[index].key;

        if (result.status === "fulfilled") {
          nextGroups[type] = result.value;
        } else {
          nextErrors[type] = `Could not load ${type} targets.`;
        }
      });

      setGroups(nextGroups);
      setErrors(nextErrors);
      setLoading(false);
    };

    void fetchTargets();

    return () => {
      cancelled = true;
    };
  }, [monthDashID]);

  const visibleGroups = groups[activeTab].filter(
    (group) => group.targets.length > 0,
  );

  const total = visibleGroups.reduce(
    (count, group) => count + group.targets.length,
    0,
  );

  const completed = visibleGroups.reduce(
    (count, group) =>
      count + group.targets.filter((target) => target.completed).length,
    0,
  );

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  const getGroupTitle = (group: TargetGroup) => {
    if (activeTab === "weekly") return `Week ${group.week ?? "—"}`;
    if (activeTab === "daily") return `Day ${group.dateNo ?? "—"}`;

    return "Monthly milestones";
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-white/6 px-4 py-4">
          <FiTarget size={13} className="text-indigo-400" />

          <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Target History
          </h3>
        </div>

        {/* Body — outside the header */}
        <div className="space-y-4 px-4 py-4">
          {/* Period navigation */}
          <div
            className="grid grid-cols-3 gap-1 rounded-xl border border-white/5 bg-black/15 p-1"
            role="group"
            aria-label="Target history period"
          >
            {tabs.map(({ key, label }) => {
              const isActive = activeTab === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  aria-pressed={isActive}
                  className={`rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
                    isActive
                      ? "border-indigo-400/20 bg-indigo-500/15 text-indigo-200"
                      : "border-transparent text-gray-500 hover:bg-white/3 hover:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div
              className="space-y-3"
              role="status"
              aria-label="Loading target history"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          ) : errors[activeTab] ? (
            <div
              role="alert"
              className="flex h-50 items-center justify-center text-center"
            >
              <p className="text-xs text-rose-300">{errors[activeTab]}</p>
            </div>
          ) : total === 0 ? (
            <div className="flex h-50 flex-col items-center justify-center rounded-xl border border-dashed border-white/8 px-4 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/3">
                <FiTarget size={18} className="text-gray-500" />
              </div>

              <p className="text-xs font-medium text-gray-400">
                No {activeTab} targets recorded
              </p>

              <p className="mt-1 text-[10px] text-gray-500">
                Nothing was saved for this month.
              </p>
            </div>
          ) : (
            <>
              {/* Overall summary */}
              <div className="rounded-xl border border-white/5 bg-white/2 px-3 py-3">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <p className="text-[10px] text-gray-500">
                    <span className="font-semibold text-gray-200">
                      {completed}
                    </span>{" "}
                    of {total} completed
                  </p>

                  <span
                    className={`text-[10px] font-semibold tabular-nums ${
                      completed === total
                        ? "text-emerald-400"
                        : "text-indigo-300"
                    }`}
                  >
                    {Math.round(percentage)}%
                  </span>
                </div>

                <div className="h-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${
                      completed === total
                        ? "bg-emerald-400/80"
                        : "bg-indigo-400/80"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Read-only target groups */}
              <div className="h-80 space-y-5 overflow-y-auto pr-1">
                {visibleGroups.map((group) => {
                  const groupCompleted = group.targets.filter(
                    (target) => target.completed,
                  ).length;

                  const allCompleted = groupCompleted === group.targets.length;

                  return (
                    <section key={group._id}>
                      <div className="mb-2.5 flex items-center gap-3">
                        <h3 className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                          {getGroupTitle(group)}
                        </h3>

                        <div className="h-px flex-1 bg-white/5" />

                        <span
                          className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-medium tabular-nums ${
                            allCompleted
                              ? "border-emerald-500/15 bg-emerald-500/5 text-emerald-400"
                              : "border-white/5 bg-white/2 text-gray-500"
                          }`}
                        >
                          {groupCompleted}/{group.targets.length}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {group.targets.map((target, index) => (
                          <li
                            key={target._id}
                            className={`flex items-start gap-3 rounded-xl border p-3 transition-colors duration-200 ${
                              target.completed
                                ? "border-emerald-500/15 bg-emerald-500/5 hover:bg-emerald-500/8"
                                : "border-white/6 bg-white/2 hover:border-white/10 hover:bg-white/3"
                            }`}
                          >
                            {/* Status display, not an editable checkbox */}
                            <span
                              aria-hidden="true"
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
                                target.completed
                                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                  : "border-indigo-400/15 bg-indigo-500/8 text-indigo-300/70"
                              }`}
                            >
                              {target.completed ? (
                                <FiCheck size={13} strokeWidth={2.5} />
                              ) : (
                                <span className="text-[10px] font-semibold tabular-nums">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                              )}
                            </span>

                            <div className="min-w-0 flex-1">
                              <p
                                className={`whitespace-pre-wrap wrap-break-word text-xs font-medium leading-relaxed ${
                                  target.completed
                                    ? "text-emerald-50/80"
                                    : "text-gray-300"
                                }`}
                              >
                                {target.value}
                              </p>

                              <p
                                className={`mt-1 text-[9px] font-medium ${
                                  target.completed
                                    ? "text-emerald-400/70"
                                    : "text-gray-500"
                                }`}
                              >
                                {target.completed
                                  ? "Completed"
                                  : "Not completed"}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            </>
          )}

          <div className="flex items-center gap-1.5 border-t border-white/5 pt-3 text-gray-500">
            <FiLock size={10} />
            <span className="text-[9px]">Archived targets · Read only</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TargetHistory;
