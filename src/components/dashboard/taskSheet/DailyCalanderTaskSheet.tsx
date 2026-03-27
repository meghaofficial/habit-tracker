import { useEffect, useState } from "react";
import CustomCheckbox from "./CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store/store";
import { daysNums, weekLetters } from "../../../staticData";
import { useParams } from "react-router-dom";
import { addCheckboxKey, removeCheckboxKey, updateDaywiseCount, updateTaskCount, updateTotalTasks } from "../../../redux/slices/monthlySlice";

type CompType = {
  rows: number;
  setRows: React.Dispatch<React.SetStateAction<number>>;
  rowLimit: number;
};

const DailyCalanderTaskSheet = ({ rows, setRows, rowLimit }: CompType) => {
  const [checkboxData, setCheckboxData] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch<AppDispatch>();
  const { year, month } = useParams<{ year: string; month: string }>();
  const [totalD, setTotalD] = useState(0);
  const [firstDay, setFirstDay] = useState<number>(0);

  const monthlyData = useSelector(
    (state: RootState) => state.monthlyData
  );

  const toggleCheckbox = (key: string) => {
    if (!year || !month) return;
    const isCurrentlyChecked = checkboxData?.[key] ?? false;
    const newValue = !isCurrentlyChecked;

    setCheckboxData((prev) => {
      const updated = {
        ...prev,
        [key]: !prev[key],
      };
      dispatch(updateTaskCount({ year, month, checkboxData: updated }));
      return updated;
    });
    const i1 = Number(key?.split("-")[1]) * 7;
    const day = Number(key?.split("-")[2]) + i1 + 1;
    dispatch(updateDaywiseCount({ year, month, day, isMarked: !checkboxData?.[key] }));
    if (newValue) {
      dispatch(addCheckboxKey({ year, month, cbk: key }));
    } else {
      dispatch(removeCheckboxKey({ year, month, cbk: key }));
    }
  };

  useEffect(() => {
    if (!month || !year) return;
    setTotalD(monthlyData[year][month].totalDaysInMonth);
    setFirstDay(monthlyData[year][month].firstDay);
  }, [month, year]);

  useEffect(() => {
    if (monthlyData){
      if (month && year){
        setRows(monthlyData[year][month].totalTasks)
      }
    }
  }, [monthlyData]);


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
                      checked={
                        year && month
                          ? monthlyData[year][month].checkboxKeys.includes(key)
                          : checkboxData[key] ?? false
                      }
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
                      checked={
                        year && month
                          ? monthlyData[year][month].checkboxKeys.includes(key)
                          : checkboxData[key] ?? false
                      }
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
          onClick={() => {
            setRows((prev) => prev + 1)
            if (!year || !month) return;
            dispatch(
              updateTotalTasks({
                year,
                month,
                totalRows: rows + 1
              })
            );
          }}
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
                      <div className={`w-2.5 bg-headerBg`} style={{ height: `${year && month && monthlyData[year][month].daywise[idx].progress}%` }}></div>
                    </div>
                    <span className="text-[6px]">{year && month && Math.floor(monthlyData[year][month].daywise[idx].progress)}%</span>
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
                      <div className={`w-2.5 bg-headerBg`} style={{ height: `${year && month && monthlyData[year][month].daywise[idx].progress}%` }}></div>
                    </div>
                    <span className="text-[6px]">{year && month && Math.floor(monthlyData[year][month].daywise[idx].progress)}%</span>
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