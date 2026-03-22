import { useEffect, useState } from "react";
import CustomCheckbox from "./CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store/store";
import { setTaskwiseData } from "../../../redux/slices/taskwiseSlice";
import { setTotalDays, setTotalDaysWorked } from "../../../redux/slices/progressSlice";
import { setDaywiseData } from "../../../redux/slices/daywiseSlice";
import { daysNums, months, weekLetters } from "../../../staticData";
import { useParams } from "react-router-dom";
import { getDaysInMonth, getFirstDayOfMonth } from "../../../helper";

type CompType = {
  rows: number;
  setRows: React.Dispatch<React.SetStateAction<number>>;
  rowLimit: number;
};

const DailyCalanderTaskSheet = ({ rows, setRows, rowLimit }: CompType) => {
  const [checkboxData, setCheckboxData] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch<AppDispatch>();
  const taskwiseData = useSelector(
    (state: RootState) => state.taskwiseData
  );
  const daywiseData = useSelector(
    (state: RootState) => state.daywiseData
  );
  const { year, month } = useParams<{ year: string; month: string }>();

  // setting up task wise data - (taskwiseSlice)
  // useEffect(() => {
  //   const result: Record<number, { task: string; count: number; progress: number }> = {};
  //   for (let i = 0; i < rows; i++) {
  //     result[i] = { task: "", count: 0, progress: 0 };
  //   }
  //   Object.entries(checkboxData).forEach(([key, value]) => {
  //     if (!value) return;

  //     const rowIndex = Number(key.split("-")[0]);
  //     result[rowIndex].count += 1;
  //   });
  //   Object.keys(result).forEach((row) => {
  //     const count = result[Number(row)].count;
  //     result[Number(row)].progress = Math.floor((count / 30) * 100);
  //   });
  //   dispatch(setTaskwiseData(result));
  // }, [checkboxData, rows, dispatch]);

  useEffect(() => {
    const result: Record<number, { task: string; count: number; progress: number }> = {};
    for (let i = 0; i < rows; i++) {
      result[i] = { task: "", count: 0, progress: 0 };
    }
    dispatch(setTaskwiseData(result));
  }, [rows]);

  // setting up total days worked - (progressSlice)
  useEffect(() => {
    const totalWorked = Object.values(taskwiseData)
      .reduce((sum, row) => sum + row.count, 0);
    dispatch(setTotalDaysWorked(totalWorked));
  }, [taskwiseData, dispatch]);

  // setting up total days - (progressSlice)
  useEffect(() => {
    const res = rows * 31;
    dispatch(setTotalDays(res));
  }, [rows]);

  // setting up day wise data - (daywiseSlice)
  useEffect(() => {
    const result: Record<number, { count: number; progress: number }> = {};
    for (let i = 0; i <= 31; i++) {
      result[i] = { count: 0, progress: 0 };
    }
    Object.entries(checkboxData).forEach(([key, value]) => {
      if (!value) return;

      const weekIndex = Number(key.split("-")[1]) * 7;
      const dayIndex = Number(key.split("-")[2]) + weekIndex + 1;
      result[dayIndex - 1].count += 1;
    });
    Object.keys(result).forEach((col) => {
      const count = result[Number(col)].count;
      result[Number(col)].progress = Math.floor((count / rows) * 100);
    });
    dispatch(setDaywiseData(result));
  }, [checkboxData, rows, dispatch]);

  const toggleCheckbox = (key: string) => {
    setCheckboxData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [totalD, setTotalD] = useState(0);
  const [firstDay, setFirstDay] = useState<number>(0);

  useEffect(() => {
    const res = getDaysInMonth(Number(year), Object.keys(months).indexOf(month || ""));
    setTotalD(res);
    const firstDayNo = getFirstDayOfMonth(Number(year), Object.keys(months).indexOf(month || ""));
    setFirstDay(firstDayNo);
  }, [month]);

  return (
    <div className="flex flex-col w-full relative">
      <div className="border w-full">

        {/* Week Header */}
        <div className="bg-headerBg text-headerText font-semibold p-2 text-[10px] tracking-wider flex items-center w-full">
          <p className={`${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>WEEK 1</p>
          <p className={`${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>WEEK 2</p>
          <p className={`${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>WEEK 3</p>
          <p className={`${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>WEEK 4</p>
          {totalD > 28 && (
            <p className={`w-[12%] text-center`}>WEEK 5</p>
          )}
        </div>

        {/* Week Letters */}
        <div className="bg-[#DFEEF5] p-2 text-[10px] flex items-center w-full">
          {Array.from({ length: 4 }).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
            >
              {Array.from({ length: 7 + firstDay }).slice(firstDay, 7 + firstDay).map((_, index) => (
                <p key={index}>{weekLetters[(index + firstDay) % 7]}</p>
              ))}
            </div>
          ))}
          {totalD > 28 && (
            <div className="flex items-center justify-evenly w-[12%] text-center">
              {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((_, index) => (
                <p key={index}>{weekLetters[(index + firstDay) % 7]}</p>
              ))}
            </div>
          )}
        </div>

        {/* Date Numbers */}
        <div className="bg-[#F8FDFF] p-2 text-[10px] tracking-wider flex items-center w-full border-b border-headerBg">
          <div className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>
            {daysNums.slice(0, 7).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>
            {daysNums.slice(7, 14).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>
            {daysNums.slice(14, 21).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}>
            {daysNums.slice(21, 28).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          {totalD > 28 && (
            <div className="flex items-center justify-evenly w-[12%] text-center">
              {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((num) => (
                <p key={num}>{num} </p>
              ))}
            </div>
          )}
        </div>

        {/* Checkbox Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="p-2 flex items-center w-full border-b border-gray-300"
          >

            {/* Weeks 1–4 */}
            {Array.from({ length: 4 }).map((_, weekIndex) => (
              <div
                key={weekIndex}
                className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
              >
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const key = `${rowIndex}-${weekIndex}-${dayIndex}`;

                  return (
                    <CustomCheckbox
                      key={dayIndex}
                      checked={checkboxData[key] ?? false}
                      onChange={() => toggleCheckbox(key)}
                      color="headerBg"
                      size={10}
                    />
                  );
                })}
              </div>
            ))}

            {/* Week 5 */}
            {totalD > 28 && (
              <div className="flex items-center justify-evenly w-[12%] text-center">
                {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((num, dayIndex) => {
                  const key = `${rowIndex}-4-${dayIndex}`;
                  return (
                    <CustomCheckbox
                      key={dayIndex}
                      checked={checkboxData[key] ?? false}
                      onChange={() => toggleCheckbox(key)}
                      color="headerBg"
                      size={10}
                    />
                  )
                })}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Add Row Button */}
      {rows < rowLimit && (
        <button
          className="border border-black/50 cursor-pointer mt-3 smText p-1.5"
          onClick={() => setRows((prev) => prev + 1)}
        >
          ADD ROW +
        </button>
      )}

      {/* Day wise (column wise progress) */}
      <div className="absolute flex gap-2 w-full justify-center -top-22">
        <div
          className="p-2 flex items-center w-full"
        >

          {/* Weeks 1–4 */}
          {Array.from({ length: 4 }).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className={`flex items-center justify-evenly ${totalD > 28 ? 'w-[22%]' : 'w-[25%]'} text-center`}
            >
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const i1 = weekIndex * 7;
                const idx = dayIndex + i1 + 1;
                return (
                  <div key={dayIndex}>
                    <div className={`h-10 w-2.5 flex items-end`}>
                      <div className={`w-2.5 bg-headerBg`} style={{ height: `${daywiseData?.[idx - 1]?.progress || 0}%` }}></div>
                    </div>
                    <span className="text-[6px]">{daywiseData?.[idx - 1]?.progress || 0}%</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Week 5 (3 days) */}
          {totalD > 28 && (
            <div className="flex items-center justify-evenly w-[12%] text-center">
              {Array.from({ length: totalD - 28 }, (_, i) => 29 + i).map((_, dayIndex) => {
                const i1 = 4 * 7;
                const idx = dayIndex + i1 + 1;
                return (
                  <div key={dayIndex}>
                    <div className={`h-10 w-2.5 flex items-end`}>
                      <div className={`w-2.5 bg-headerBg`} style={{ height: `${daywiseData?.[idx - 1]?.progress || 0}%` }}></div>
                    </div>
                    <span className="text-[6px]">{daywiseData?.[idx - 1]?.progress || 0}%</span>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DailyCalanderTaskSheet;