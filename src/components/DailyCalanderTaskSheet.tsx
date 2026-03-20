import { useEffect, useState } from "react";
import CustomCheckbox from "./CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { setTaskwiseData } from "../slices/taskwiseSlice";
import { setTotalDaysWorked } from "../slices/progressSlice";

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

  useEffect(() => {
    const result: Record<number, { count: number; progress: number }> = {};

    for (let i = 0; i < rows; i++) {
      result[i] = { count: 0, progress: 0 };
    }

    Object.entries(checkboxData).forEach(([key, value]) => {
      if (!value) return;

      const rowIndex = Number(key.split("-")[0]);
      result[rowIndex].count += 1;
    });

    Object.keys(result).forEach((row) => {
      const count = result[Number(row)].count;
      result[Number(row)].progress = Math.floor((count / 30) * 100);
    });

    dispatch(setTaskwiseData(result));

  }, [checkboxData, rows, dispatch]);

  useEffect(() => {
    const totalWorked = Object.values(taskwiseData)
      .reduce((sum, row) => sum + row.count, 0);
    dispatch(setTotalDaysWorked(totalWorked));

  }, [taskwiseData, dispatch]);

  const toggleCheckbox = (key: string) => {
    setCheckboxData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="border w-full">

        {/* Week Header */}
        <div className="bg-tropicalAqua text-white p-2 text-[10px] tracking-wider flex items-center w-full">
          <p className="w-[22%] text-center">WEEK 1</p>
          <p className="w-[22%] text-center">WEEK 2</p>
          <p className="w-[22%] text-center">WEEK 3</p>
          <p className="w-[22%] text-center">WEEK 4</p>
          <p className="w-[12%] text-center">WEEK 5</p>
        </div>

        {/* Week Letters */}
        <div className="bg-mintGlass p-2 text-[10px] flex items-center w-full">
          {Array.from({ length: 4 }).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className="flex items-center justify-evenly w-[22%] text-center"
            >
              {weekLetters.map((wl, dayIndex) => (
                <p key={dayIndex}>{wl}</p>
              ))}
            </div>
          ))}

          <div className="flex items-center justify-evenly w-[12%] text-center">
            {weekLetters.slice(0, 3).map((wl, index) => (
              <p key={index}>{wl}</p>
            ))}
          </div>
        </div>

        {/* Date Numbers */}
        <div className="bg-mintMist p-2 text-[10px] tracking-wider flex items-center w-full border-b border-tropicalAqua">
          <div className="flex items-center justify-evenly w-[22%] text-center">
            {daysNums.slice(0, 7).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className="flex items-center justify-evenly w-[22%] text-center">
            {daysNums.slice(7, 14).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className="flex items-center justify-evenly w-[22%] text-center">
            {daysNums.slice(14, 21).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className="flex items-center justify-evenly w-[22%] text-center">
            {daysNums.slice(21, 28).map((d, index) => (
              <p key={index}>{d}</p>
            ))}
          </div>

          <div className="flex items-center justify-evenly w-[12%] text-center">
            <p>28</p>
            <p>29</p>
            <p>30</p>
          </div>
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
                className="flex items-center justify-evenly w-[22%] text-center"
              >
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const key = `${rowIndex}-${weekIndex}-${dayIndex}`;

                  return (
                    <CustomCheckbox
                      key={dayIndex}
                      checked={checkboxData[key] ?? false}
                      onChange={() => toggleCheckbox(key)}
                      color="tropicalAqua"
                      size={10}
                    />
                  );
                })}
              </div>
            ))}

            {/* Week 5 (3 days) */}
            <div className="flex items-center justify-evenly w-[12%] text-center">
              {Array.from({ length: 3 }).map((_, dayIndex) => {
                const key = `${rowIndex}-4-${dayIndex}`;

                return (
                  <CustomCheckbox
                    key={dayIndex}
                    checked={checkboxData[key] ?? false}
                    onChange={() => toggleCheckbox(key)}
                    color="tropicalAqua"
                    size={10}
                  />
                );
              })}
            </div>

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
    </div>
  );
};

const weekLetters = ["S", "M", "T", "W", "T", "F", "S"];

const daysNums = [
  1, 2, 3, 4, 5, 6, 7,
  8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28,
  29, 30, 31,
];

export default DailyCalanderTaskSheet;