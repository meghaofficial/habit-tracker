import { useEffect, useRef, useState } from 'react';
import { axiosPrivate } from '../../../api/axios';
import { notify } from '../../../helper';

const MonthlyNote = ({ monthID }: { monthID: string }) => {

  const [note, setNote] = useState("");
  const [monthlyNote, setMonthlyNote] = useState(note);
  const prevMonNoteRef = useRef(note);

  // sync when prop changes
  useEffect(() => {
    setMonthlyNote(note);
    prevMonNoteRef.current = note;
  }, [note]);

  useEffect(() => {
    if (monthlyNote === prevMonNoteRef.current) return;

    const timeout = setTimeout(() => {
      axiosPrivate.put(`/api/monthly-note?monthDashID=${monthID}`, {
        note: monthlyNote,
      }).catch(() => notify.error("Please try again."));

      prevMonNoteRef.current = monthlyNote;

    }, 500);

    return () => clearTimeout(timeout);
  }, [monthlyNote]);

  const getNote = async () => {
    try {
      const res = await axiosPrivate.get(`/api/monthly-note?monthDashID=${monthID}`);
      if (res?.data?.success) {
        setNote(res?.data?.note?.note);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const noteRef = useRef(false);

  useEffect(() => {
    if (noteRef.current || !monthID) return;
    getNote();
    noteRef.current = true;
  }, [monthID]);

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