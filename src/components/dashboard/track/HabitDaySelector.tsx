// import { useState } from "react";
// import { motion } from "framer-motion";

// interface HabitDaySelectorProps {
//   totalD: number;
//   firstDay: number; // 0 = Sun, 1 = Mon, ... 6 = Sat
//   todayDate?: number;
//   initialDisabledDays?: number[];
//   onChange?: (disabledDays: number[]) => void;
// }

// const weekLetters = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// const HabitDaySelector = ({
//   totalD,
//   firstDay,
//   todayDate,
//   initialDisabledDays = [],
//   onChange,
// }: HabitDaySelectorProps) => {
//   const [disabledDays, setDisabledDays] = useState<Set<number>>(
//     () => new Set(initialDisabledDays),
//   );

//   const totalWeeks = Math.ceil(totalD / 7);

//   const toggleDay = (dayNum: number) => {
//     setDisabledDays((prev) => {
//       const next = new Set(prev);

//       if (next.has(dayNum)) {
//         next.delete(dayNum);
//       } else {
//         next.add(dayNum);
//       }

//       onChange?.([...next].sort((a, b) => a - b));

//       return next;
//     });
//   };

//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="mb-4 flex items-center justify-between">
//         <div>
//           <p className="text-xs font-medium text-slate-300">
//             Choose active days
//           </p>

//           <p className="mt-0.5 text-[11px] text-slate-500">
//             Tap a day to block it from habit tracking
//           </p>
//         </div>

//         <span className="text-[11px] text-slate-500">
//           {totalD - disabledDays.size}/{totalD} active
//         </span>
//       </div>

//       {/* Weekday labels */}
//       <div className="grid grid-cols-7 gap-1.5 mb-1.5">
//         {Array.from({ length: 7 }).map((_, i) => (
//           <div
//             key={i}
//             className="text-center text-[9px] font-semibold uppercase tracking-wide text-slate-600"
//           >
//             {weekLetters[(i + firstDay) % 7]}
//           </div>
//         ))}
//       </div>

//       {/* Dates */}
//       <div className="space-y-1.5">
//         {Array.from({ length: totalWeeks }).map((_, weekIndex) => (
//           <div key={weekIndex} className="grid grid-cols-7 gap-1.5">
//             {Array.from({ length: 7 }).map((_, i) => {
//               const dayNum = weekIndex * 7 + i + 1;

//               if (dayNum > totalD) {
//                 return <div key={i} />;
//               }

//               const isDisabled = disabledDays.has(dayNum);
//               const isToday = dayNum === todayDate;

//               return (
//                 <motion.button
//                   key={i}
//                   type="button"
//                   onClick={() => toggleDay(dayNum)}
//                   whileHover={{ y: -1 }}
//                   whileTap={{ scale: 0.96 }}
//                   className={`
//                     h-9 rounded-lg border
//                     text-xs font-semibold
//                     transition-all duration-200
//                     ${
//                       isDisabled
//                         ? "border-white/5 bg-white/2.5 text-slate-600"
//                         : isToday
//                           ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-400"
//                           : "border-emerald-500/20 bg-emerald-500/8 text-slate-300 hover:border-white/25 hover:bg-white/8"
//                     }
//                   `}
//                 >
//                   {dayNum}
//                 </motion.button>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HabitDaySelector;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HabitDaySelectorProps {
  totalD: number;
  firstDay: number; // 0 = Sun, 1 = Mon, ... 6 = Sat
  todayDate?: number;
  initialDisabledDays?: number[];
  onChange?: (disabledDays: number[]) => void;
  onCancel?: () => void;
}

const weekLetters = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HabitDaySelector = ({
  totalD,
  firstDay,
  todayDate,
  initialDisabledDays = [],
  onChange,
  onCancel,
}: HabitDaySelectorProps) => {
  const [disabledDays, setDisabledDays] =
    useState<number[]>(initialDisabledDays);

  const [allDaysEnabled, setAllDaysEnabled] = useState(
    initialDisabledDays.length === 0,
  );

  const totalWeeks = Math.ceil(totalD / 7);

  useEffect(() => {
    setDisabledDays(initialDisabledDays);
    setAllDaysEnabled(initialDisabledDays.length === 0);
  }, [initialDisabledDays]);

  const toggleDay = (dayNum: number) => {
    setDisabledDays((prev) => {
      const exists = prev.includes(dayNum);

      const updated = exists
        ? prev.filter((day) => day !== dayNum)
        : [...prev, dayNum];

      return updated.sort((a, b) => a - b);
    });

    // Once a specific day is changed, we're in custom mode
    setAllDaysEnabled(false);
  };

  const toggleAllDays = () => {
    if (allDaysEnabled) {
      // Turn OFF "all days"
      // Keep current selection so user can customize it
      setAllDaysEnabled(false);
      return;
    }

    // Turn ON "all days"
    setAllDaysEnabled(true);
    setDisabledDays([]);
  };

  const handleUpdate = () => {
    onChange?.(allDaysEnabled ? [] : disabledDays);
  };

  const activeDays = allDaysEnabled ? totalD : totalD - disabledDays.length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">
              Choose active days
            </p>

            <p className="mt-0.5 text-[10px] text-slate-500">
              Block days you skip.
            </p>
          </div>

          {/* Active count + toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              {activeDays}/{totalD} active
            </span>

            <button
              type="button"
              onClick={toggleAllDays}
              aria-label="Toggle all days"
              className={`relative h-5 w-9 shrink-0 rounded-full border transition-all duration-200 ${
                allDaysEnabled
                  ? "border-indigo-400/30 bg-indigo-500/60"
                  : "border-white/10 bg-white/[0.06]"
              }`}
            >
              <motion.span
                animate={{
                  x: allDaysEnabled ? 16 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className="absolute left-0.5 top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="mb-1.5 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="text-center text-[9px] font-semibold uppercase tracking-wide text-slate-600"
          >
            {weekLetters[(i + firstDay) % 7]}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="space-y-1.5">
        {Array.from({ length: totalWeeks }).map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const dayNum = weekIndex * 7 + i + 1;

              if (dayNum > totalD) {
                return <div key={i} />;
              }

              const isDisabled = disabledDays.includes(dayNum);
              const isToday = dayNum === todayDate;

              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(dayNum)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className={`
                    h-9 rounded-lg border
                    text-xs font-semibold
                    transition-all duration-200
                    ${
                      isDisabled
                        ? "border-white/5 bg-white/[0.025] text-slate-600"
                        : isToday
                          ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-400"
                          : "border-emerald-500/20 bg-emerald-500/[0.08] text-slate-300 hover:border-white/25 hover:bg-white/[0.08]"
                    }
                  `}
                >
                  {dayNum}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/[0.06] pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[11px] font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-300"
        >
          Cancel
        </button>

        <motion.button
          type="button"
          onClick={handleUpdate}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-lg border border-indigo-400/25 bg-indigo-500/15 px-3.5 py-1.5 text-[11px] font-medium text-indigo-300 transition hover:bg-indigo-500/20"
        >
          Update
        </motion.button>
      </div>
    </div>
  );
};

export default HabitDaySelector;
