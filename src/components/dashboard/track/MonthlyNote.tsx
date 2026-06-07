import { useEffect, useRef, useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import { formatTimestamp, notify } from "../../../helper";
import Card from "../../shared/Card";
import { socket } from "../../../socket/socket";

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

      setMonthlyNote(data.note.note);
      setLastUpdates(data.note.updatedAt);
    };

    socket.on("update-monthly-note", onNoteUpdate);

    return () => {
      socket.off("update-monthly-note", onNoteUpdate);
    };
  }, []);

  return (
    <>
      <Card
        heading="Monthly Notes"
        subHeading="Reflect on your progress, motivation and goals."
        cardWidth="sm:w-1/3"
      >
        {lastUpdated && (
          <div className="relative z-10 mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 light:border-black/10 bg-white/5 light:bg-black/5 px-4 py-2 text-[12px] text-darkSubText light:text-lightSubText ">
            <div className="h-2 w-2 rounded-full bg-darkSuccess" />
            Last updated • {formatTimestamp(lastUpdated)}
          </div>
        )}
        <div className="relative z-10 mt-5">
          <textarea
            value={monthlyNote}
            onChange={(e) => setMonthlyNote(e.target.value)}
            placeholder="Write your thoughts, goals, wins, lessons or motivation for this month..."
            className="h-80 w-full resize-none rounded-2xl border border-white/10 dark:border-black/10 bg-white/3 light:bg-black/5 px-5 py-4 text-[15px] leading-7 text-white outline-none placeholder:text-white/25 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)] transition-all duration-300 focus:border-[#8B5CF6]/40 focus:bg-white/5 focus:shadow-[0_0_25px_rgba(139,92,246,0.15)] light:text-lightText light:placeholder:text-lightSubText "
          />
        </div>
        <div className="relative z-10 mt-4 flex items-center justify-between">
          <p className="text-[12px] text-darkSubText light:text-lightSubText">
            {monthlyNote?.length || 0} characters
          </p>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-[#8B5CF6]"
                style={{ opacity: i / 3 }}
              />
            ))}
          </div>
        </div>
      </Card>
    </>
  );
};

export default MonthlyNote;
