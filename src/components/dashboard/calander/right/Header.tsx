import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Card from "../../../shared/Card";
import { monMap } from "../../../../staticData";
import { FaCalendarDays } from "react-icons/fa6";

type HeaderProps = {
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handlePrevYear: () => void;
  handleNextYear: () => void;
  currentViewDate: Date;
};

const Header = ({
  handlePrevMonth,
  handleNextMonth,
  handlePrevYear,
  handleNextYear,
  currentViewDate,
}: HeaderProps) => {
  const month = currentViewDate.getMonth();
  const year = currentViewDate.getFullYear();
  const monthStr = monMap[month + 1];

  return (
    <Card heading="" cardWidth="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/20 text-indigo-400">
            <FaCalendarDays />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
              Timeline
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Manage your monthly schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider p-1.5 flex items-center gap-3 backdrop-blur-md">
            <button
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
              onClick={handlePrevMonth}
            >
              <MdKeyboardArrowLeft size={18} />
            </button>
            <span className="w-16 text-center text-purple-100">{monthStr}</span>
            <button
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
              onClick={handleNextMonth}
            >
              <MdKeyboardArrowRight size={18} />
            </button>
          </div>

          {/* Year Selector */}
          <div className="bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider p-1.5 flex items-center gap-3 backdrop-blur-md">
            <button
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
              onClick={handlePrevYear}
            >
              <MdKeyboardArrowLeft size={18} />
            </button>
            <span className="w-10 text-center text-blue-100">{year}</span>
            <button
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
              onClick={handleNextYear}
            >
              <MdKeyboardArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Header;
