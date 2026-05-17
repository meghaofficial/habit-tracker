import { useEffect, useRef, useState } from 'react';
import { axiosPrivate } from '../../../api/axios';
import { notify } from '../../../helper';

const MonthlyNote = ({ monthID }: { monthID: string }) => {
  const [monthlyNote, setMonthlyNote] = useState("");
  
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
    <div className="bg-darkCard light:bg-lightCard w-1/3 rounded-2xl p-2 h-100 overflow-y-auto">
      <p className="font-semibold text-lg px-5 py-3">Note for this Month</p>

      <div className="px-4">
        <textarea
          value={monthlyNote}
          onChange={(e) => setMonthlyNote(e.target.value)}
          className="outline-none bg-darkBox light:bg-lightBg resize-none rounded-xl px-3 py-2 text-[14px] w-full h-78"
          placeholder="Write something for this month for your motivation."
        />
      </div>
    </div>
  );
};

export default MonthlyNote;