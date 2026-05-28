import { useEffect, useRef, useState } from 'react';
import { axiosPrivate } from '../../../api/axios';
import { notify } from '../../../helper';

function formatTimestamp(isoString: string) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle '0' hours as '12'
  return `${day}-${monthName}-${year} | ${hours}:${minutes} ${ampm}`;
}

const MonthlyNote = ({ monthID }: { monthID: string }) => {
  const [monthlyNote, setMonthlyNote] = useState("");
  const [lastUpdated, setLastUpdates] = useState("");

  // Keeps track of what is currently saved on the server
  const serverNoteRef = useRef("");

  // 1. Fetch note when monthID changes
  const getNote = async () => {
    try {
      const res = await axiosPrivate.get(`/api/monthly-note?monthDashID=${monthID}`);
      if (res?.data?.success) {
        const fetchedNote = res?.data?.note?.note || "";
        serverNoteRef.current = fetchedNote; // Update server reference first
        setMonthlyNote(fetchedNote);         // Then update UI state
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

  // 2. Auto-save only when user input differs from server state
  useEffect(() => {
    // If the state matches what's on the server, skip the API call
    if (monthlyNote === serverNoteRef.current) return;

    const timeout = setTimeout(() => {
      axiosPrivate.put(`/api/monthly-note?monthDashID=${monthID}`, {
        note: monthlyNote,
      })
        .then(() => {
          // Update the server reference after a successful save
          serverNoteRef.current = monthlyNote;
        })
        .catch(() => notify.error("Please try again."));
    }, 500);

    return () => clearTimeout(timeout);
  }, [monthlyNote, monthID]);

  return (
    <div
  className="
    relative overflow-hidden
    rounded-[30px]
    border border-white/10
    bg-black/20
    p-5
    shadow-[0_20px_60px_rgba(0,0,0,0.18)]
    backdrop-blur-2xl
    light:bg-lightCard
    sm:w-1/3
  "
>
  {/* Glow */}
  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#8B5CF6]/10 blur-3xl" />

  {/* Header */}
  <div className="relative z-10 flex items-start justify-between">
    <div>
      <p className="text-[22px] font-bold tracking-[-0.03em] text-white light:text-lightText">
        Monthly Notes
      </p>

      <p className="mt-1 text-[13px] leading-6 text-darkSubText light:text-lightSubText">
        Reflect on your progress, motivation and goals.
      </p>
    </div>

    <div
      className="
        flex h-11 w-11 items-center justify-center
        rounded-2xl
        border border-white/10
        bg-gradient-to-br from-[#6366F1] to-[#A855F7]
        shadow-[0_10px_30px_rgba(99,102,241,0.35)]
      "
    >
      ✦
    </div>
  </div>

  {/* Last Updated */}
  {lastUpdated && (
    <div
      className="
        relative z-10 mt-5
        inline-flex items-center gap-2
        rounded-full
        border border-white/10
        bg-white/5
        px-4 py-2
        text-[12px]
        text-darkSubText
        backdrop-blur-xl
        light:text-lightSubText
      "
    >
      <div className="h-2 w-2 rounded-full bg-[#22c55e]" />

      Last updated • {formatTimestamp(lastUpdated)}
    </div>
  )}

  {/* Textarea */}
  <div className="relative z-10 mt-5">
    <textarea
      value={monthlyNote}
      onChange={(e) => setMonthlyNote(e.target.value)}
      placeholder="Write your thoughts, goals, wins, lessons or motivation for this month..."
      className="
        h-[320px] w-full resize-none
        rounded-[24px]
        border border-white/10
        bg-white/[0.03]
        px-5 py-4
        text-[15px]
        leading-7
        text-white
        outline-none
        placeholder:text-white/25
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]
        backdrop-blur-xl
        transition-all duration-300
        focus:border-[#8B5CF6]/40
        focus:bg-white/[0.05]
        focus:shadow-[0_0_25px_rgba(139,92,246,0.15)]
        light:text-lightText
        light:placeholder:text-lightSubText
      "
    />
  </div>

  {/* Footer */}
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
</div>
  );
};

export default MonthlyNote;