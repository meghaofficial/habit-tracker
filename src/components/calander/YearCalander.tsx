import { useEffect, useState } from "react"
import { months, weekColors } from "../../staticData"
import MonthCalander from "./MonthCalander";
import { useNavigate } from "react-router-dom";
import { RxExternalLink } from "react-icons/rx";

const YearCalander = () => {

  const [selectedMon, setSelectedMon] = useState<string>("");
  const [currYear, setCurrYear] = useState(0);
  const [todayDate, setTodayDate] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    setSelectedMon(Object.keys(months)[m]);
    setCurrYear(y);
    setTodayDate(d);
  }, []);

  return (
    <>
      <div className="h-screen flex">
        <div className="w-[30%] bg-[#3F52B4] h-full flex flex-col items-center justify-center">
          <p className="font-bold text-white text-[80px] mb-5">{currYear}</p>
          <div className="grid grid-cols-4 text-white gap-6 google-sans">
            {Object.keys(months).map((m, index) => (
              <span key={index} className={`cursor-pointer text-center p-2 rounded-lg ${selectedMon === m && 'bg-[#FFA34B]'}`} onClick={() => setSelectedMon(m)}>{m}</span>
            ))}
          </div>
        </div>
        <div className="w-[70%] overflow-y-auto">
          <div className="flex items-center justify-center relative">
            <p className="p-3 text-[40px] font-extrabold playfair-display">{months?.[selectedMon]}</p>
            <RxExternalLink className="cursor-pointer" onClick={() => navigate(`/${currYear}/${selectedMon}`)} />
            <div className="absolute right-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="rounded p-1 flex items-center justify-center cursor-pointer shadow" style={{ backgroundColor: weekColors[index] }} onClick={() => navigate(`/week-${index+1}`)}>
                  <span className="text-[8px]">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <MonthCalander year={currYear} month={Object.keys(months).indexOf(selectedMon)} todayDate={todayDate} />
        </div>
      </div>
    </>
  )
}

export default YearCalander
