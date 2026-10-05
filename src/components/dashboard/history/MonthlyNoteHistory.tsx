import { useEffect, useState } from "react";
import { FiClock, FiFileText, FiLock } from "react-icons/fi";
import { axiosPrivate } from "../../../api/axios";
import { formatTimestamp } from "../../../helper";
import Container from "../../utils/Container";

interface MonthlyNoteResponse {
  success: boolean;
  note?: {
    note?: string;
    updatedAt?: string;
  } | null;
}

const MonthlyNoteHistory = ({ monthDashID }: { monthDashID: string }) => {
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setNote("");
    setLastUpdate("");
    setError("");

    if (!monthDashID) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const getNote = async () => {
      try {
        const { data } = await axiosPrivate.get<MonthlyNoteResponse>(
          "/api/monthly-note",
          {
            params: { monthDashID },
          },
        );

        if (!data.success) {
          throw new Error("Unable to load monthly note");
        }

        if (cancelled) return;

        setNote(data.note?.note ?? "");
        setLastUpdate(data.note?.updatedAt ?? "");
      } catch {
        if (!cancelled) {
          setError("Could not load this month's note.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void getNote();

    return () => {
      cancelled = true;
    };
  }, [monthDashID]);

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <div className="flex items-center gap-2 border-b border-white/6 px-4 py-4">
          <FiFileText size={13} className="text-indigo-400" />

          <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Monthly Note
          </h3>
        </div>

        <div className="space-y-4 px-4 py-4">
          {/* Journal label */}
          <div className="flex min-h-10 items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/15 px-3 py-2">
            <div className="flex items-center gap-2">
              <FiFileText size={13} className="text-indigo-400/80" />
              <span className="text-[11px] font-medium text-gray-300">
                Reflections & Notes
              </span>
            </div>

            <span className="rounded-md border border-indigo-400/15 bg-indigo-500/5 px-2 py-0.5 text-[9px] font-medium text-indigo-300/80">
              Archived
            </span>
          </div>

          {loading ? (
            <div
              role="status"
              aria-label="Loading monthly note"
              className="h-64 space-y-4 rounded-xl border border-white/5 bg-white/2 p-4"
            >
              {[100, 90, 95, 70, 85].map((width, index) => (
                <div
                  key={index}
                  className="h-2.5 animate-pulse rounded-full bg-white/5"
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
          ) : error ? (
            <div
              role="alert"
              className="flex h-64 items-center justify-center px-4 text-center"
            >
              <p className="text-xs text-rose-300">{error}</p>
            </div>
          ) : note.trim() ? (
            <div className="relative flex h-98 flex-col overflow-hidden rounded-xl border border-indigo-400/10 bg-indigo-500/2">
              {/* Decorative accent */}
              <div className="pointer-events-none absolute bottom-4 left-0 top-4 w-0.5 rounded-full bg-indigo-400/30" />

              <div className="flex items-center gap-3 px-4 pt-4">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-indigo-300/60">
                  A note from this month
                </span>
                <div className="h-px flex-1 bg-indigo-400/10" />
              </div>

              {/* Preserve line breaks and long text */}
              <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                <p className="whitespace-pre-wrap wrap-break-word text-xs leading-7 text-gray-300">
                  {note}
                </p>
              </div>

              <div className="mx-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-white/5 py-3">
                <span className="flex items-center gap-1.5 text-[9px] text-gray-500">
                  <FiClock size={10} />
                  Last updated
                </span>

                <span className="text-[10px] font-medium text-gray-400">
                  {lastUpdate
                    ? formatTimestamp(lastUpdate)
                    : "Date unavailable"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-white/8 px-4 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/3">
                <FiFileText size={18} className="text-gray-500" />
              </div>

              <p className="text-xs font-medium text-gray-400">
                No note recorded
              </p>

              <p className="mt-1 text-[10px] text-gray-500">
                No reflections were saved for this month.
              </p>
            </div>
          )}

          <div className="flex items-center gap-1.5 border-t border-white/5 pt-3 text-gray-500">
            <FiLock size={10} />
            <span className="text-[9px]">Archived note · Read only</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyNoteHistory;
