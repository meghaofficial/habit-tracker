import { motion, AnimatePresence } from "framer-motion";
import { months } from "../../../../staticData";
import { statusColors } from "../../../../types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store/store";
import { setNote, setStatus } from "../../../../redux/slices/dateDataSlice";

export default function RightDrawer({ open, setOpen, activeDate, year, month }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, activeDate: number, year: number, month: number }) {

  const [activeStatus, setActiveStatus] = useState("");
  const dispatch = useDispatch();
  const dateData = useSelector(
    (state: RootState) => state.dateData
  );

  const [localNote, setLocalNote] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        setNote({
          date: activeDate,
          month: Object.keys(months)[month],
          year,
          note: localNote,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [localNote]);

  useEffect(() => {
    dispatch(setStatus({
      date: activeDate,
      month: Object.keys(months)[month],
      year,
      status: activeStatus,
    }));
  }, [activeStatus]);

  useEffect(() => {
    const currDate = `${activeDate}-${Object.keys(months)[month]}-${year}`;
    if (currDate in dateData){
      setActiveStatus(dateData[currDate]?.status);
      setLocalNote(dateData[currDate]?.note || "");
    }
    else {
      setActiveStatus("default");
    }
  }, [open]);

  return (
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-100 bg-white shadow-2xl p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{`${activeDate}-${Object.keys(months)[month]}-${year}`}</h2>
                <button onClick={() => setOpen(false)}>✕</button>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                {Object.entries(statusColors).map(([key, value], index) => (
                  <div
                    key={index}
                    className='flex items-center gap-2 p-2 rounded cursor-pointer'
                    style={{ backgroundColor: value.bg, border: activeStatus === key ? `1px solid ${value.dot}` : '' }}
                    onClick={() => setActiveStatus(key)}
                  >
                    <div className={`h-2 w-2 rounded-full`} style={{ backgroundColor: value.dot }}></div>
                    <span>{key}</span>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-[12px] text-gray-600">Write about something different happened today!</p>
              <textarea
                className="resize-none outline-none border rounded border-gray-300 text-[12px] p-2 mt-1 w-full h-50"
                placeholder="Note"
                name="note"
                onChange={(e) => setLocalNote(e.target.value)}
                value={localNote}
              />

            </motion.div>
          </>
        )}
      </AnimatePresence>
  );
}