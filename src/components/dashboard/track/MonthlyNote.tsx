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
    <div className="bg-darkCard light:bg-lightCard w-1/3 rounded-2xl p-2 h-100 overflow-y-auto">
      <div className='px-5 py-3 flex flex-col '>
        <p className="font-semibold text-lg">Note for this Month</p>
        <p className='text-gray-500 text-[10px] text-nowrap'>Last Updated At - {formatTimestamp(lastUpdated)}</p>
      </div>

      <div className="px-4">
        <textarea
          value={monthlyNote}
          onChange={(e) => setMonthlyNote(e.target.value)}
          className="outline-none bg-darkBox light:bg-lightBg resize-none rounded-xl px-3 py-2 text-[14px] w-full h-77"
          placeholder="Write something for this month for your motivation."
        />
      </div>
    </div>
  );
};

export default MonthlyNote;