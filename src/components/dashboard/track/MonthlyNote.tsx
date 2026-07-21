import { useEffect, useRef, useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import { formatTimestamp, notify } from "../../../helper";
import { socket } from "../../../socket/socket";
import { FiEdit3 } from "react-icons/fi";

const MonthlyNote = ({ monthID }: { monthID: string }) => {
  const [monthlyNote, setMonthlyNote] = useState("");
  const [lastUpdated, setLastUpdates] = useState("");
  const serverNoteRef = useRef("");

  const getNote = async () => {
    try {
      const res = await axiosPrivate.get(
        `/api/monthly-note?monthDashID=${monthID}`,
      );
      if (res?.data?.success) {
        const fetchedNote = res?.data?.note?.note || "";
        serverNoteRef.current = fetchedNote;
        setMonthlyNote(fetchedNote);
        setLastUpdates(res?.data?.note?.updatedAt);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!monthID) return;
    getNote();
  }, [monthID]);

  useEffect(() => {
    if (monthlyNote === serverNoteRef.current) return;

    const timeout = setTimeout(() => {
      axiosPrivate
        .put(`/api/monthly-note?monthDashID=${monthID}`, {
          note: monthlyNote,
        })
        .then(() => {
          serverNoteRef.current = monthlyNote;
        })
        .catch(() => notify.error("Please try again."));
    }, 500);

    return () => clearTimeout(timeout);
  }, [monthlyNote, monthID]);

  // WEBSOCKET SYNCING
  useEffect(() => {
    const onNoteUpdate = (data: any) => {
      serverNoteRef.current = data.note.note;
      setLastUpdates(data.note.updatedAt);
    };

    socket.on("update-monthly-note", onNoteUpdate);

    return () => {
      socket.off("update-monthly-note", onNoteUpdate);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 sm:w-1/3 w-full flex flex-col justify-between">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-500/3 via-transparent to-transparent pointer-events-none" />

      <div>
        {/* Header */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/20 text-violet-400">
              <FiEdit3 size={14} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Monthly Notes</p>
              <p className="text-[10px] text-gray-500">
                Reflect on your progress &amp; goals
              </p>
            </div>
          </div>

          {/* Last updated badge */}
          {lastUpdated ? (
            <span className="text-[10px] text-violet-300/90 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {formatTimestamp(lastUpdated)}
            </span>
          ) : (
            <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              Not Available
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="relative p-4 flex flex-col gap-3">
          <textarea
            value={monthlyNote}
            onChange={(e) => setMonthlyNote(e.target.value)}
            placeholder="Write your thoughts, goals, wins, lessons or motivation for this month..."
            className="w-full h-70 text-[12px] leading-relaxed resize-none rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder:text-white/20 outline-none focus:border-violet-500/40 focus:bg-white/8 transition-all duration-200 hide-scrollbar"
          />

          {/* Footer */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
            <span className="text-[10px] font-medium text-gray-400">
              {monthlyNote?.length || 0} characters
            </span>

            <div className="flex items-center gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-violet-400"
                  style={{ opacity: i / 3 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyNote;

