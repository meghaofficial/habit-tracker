import { useEffect, useState } from "react";
import Card from "../../shared/Card";
import { axiosPrivate } from "../../../api/axios";
import PastMonthsData from "./PastMonthsData";
import PerformanceSummary from "./PerformanceSummary";
import type { DashboardI } from "../../../types";
import DailyHabitMatrix from "./DailyHabitMatrix";
import { monMap } from "../../../staticData";
import { IoMdHourglass } from "react-icons/io";
import SectionIcon from "../../shared/SectionIcon";
import TargetHistory from "./TargetHistory";
import MonthlyNoteHistory from "./MonthlyNoteHistory";

const HistoryMainComponent = ({ monthDashID }: { monthDashID: string }) => {
  const [monthsData, setMonthsData] = useState<DashboardI[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string>(monthDashID);
  const [selectedMonth, setSelectedMonth] = useState<DashboardI>({
    _id: "",
    userID: "",
    month: 0,
    year: 0,
    totalCount: 0,
    totalTasks: 0,
    totalDays: 0,
    firstDay: 0,
    progress: "0",
  });

  const [loading, setLoading] = useState(false);

  const getPastMonthsData = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/past-months-data`);
      if (res?.data?.success) {
        setMonthsData(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPastMonthsData();
  }, []);

  useEffect(() => {
    const foundMonth = monthsData.find((d) => d._id === selectedMonthId);
    if (foundMonth) {
      setSelectedMonth(foundMonth);
    }
  }, [selectedMonthId, monthsData]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col lg:flex-row items-start mt-4 mb-6 gap-4 w-full text-white">
          <div className="w-full lg:w-[28%] flex flex-col gap-4">
            <div className="h-70 animate-pulse bg-white/5 rounded-2xl"></div>
            <div className="h-120 animate-pulse bg-white/5 rounded-2xl"></div>
          </div>
          <div className="w-full lg:w-[72%] flex flex-col gap-4">
            <div className="h-25 animate-pulse bg-white/5 rounded-2xl"></div>
            <div className="h-70 animate-pulse bg-white/5 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-65 animate-pulse bg-white/5 rounded-2xl"></div>
              <div className="h-65 animate-pulse bg-white/5 rounded-2xl"></div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col lg:flex-row items-start my-4 gap-4 w-full text-white">
            {/* Left Sidebar: Month & Selector */}
            <div className="w-full lg:w-[28%] flex flex-col gap-4">
              <PastMonthsData
                selectedMonthId={selectedMonthId}
                setSelectedMonthId={setSelectedMonthId}
                data={monthsData}
              />
            </div>

            {/* Right Content Area: Month Details */}
            {monthsData?.length > 0 ? (
              <div className="w-full lg:w-[72%] flex flex-col gap-4">
                <div className="sm:block hidden">
                  <Card heading="" cardWidth="w-full">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-1">
                      <div className="flex items-center gap-3">
                        <SectionIcon
                          h="40px"
                          w="40px"
                          size={18}
                          Icon={IoMdHourglass}
                        />
                        <div>
                          <h1 className="text-lg font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                            {monMap[selectedMonth.month]} {selectedMonth.year}{" "}
                            Report
                          </h1>
                          <p className="text-xs text-gray-400 font-medium">
                            Historical review of your habits and milestones
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {monthsData?.length > 0 ? (
                  <PerformanceSummary
                    selectedMonth={selectedMonth}
                    monthDashID={selectedMonthId}
                  />
                ) : (
                  <div className="h-120 animate-pulse bg-white/5 rounded-2xl"></div>
                )}
              </div>
            ) : (
              <div className="w-full lg:w-[72%] flex flex-col gap-4">
                <div className="h-25 animate-pulse bg-white/5 rounded-2xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-65 animate-pulse bg-white/5 rounded-2xl"></div>
                  <div className="h-65 animate-pulse bg-white/5 rounded-2xl"></div>
                </div>
                <div className="h-70 animate-pulse bg-white/5 rounded-2xl"></div>
              </div>
            )}
          </div>

          <DailyHabitMatrix
            monthDashID={selectedMonthId}
            daysInMonth={selectedMonth.totalDays}
            selectedMonth={selectedMonth.month}
            selectedYear={selectedMonth.year}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <TargetHistory monthDashID={selectedMonthId} />
            <MonthlyNoteHistory monthDashID={selectedMonthId} />
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryMainComponent;
