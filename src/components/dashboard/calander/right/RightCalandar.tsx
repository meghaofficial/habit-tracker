import type { Dispatch, SetStateAction } from "react";
import CalandarChart from "./CalandarChart";
import Header from "./Header";
import type { CalandarDataI } from "../../../../types";

type RightCalandarProps = {
  setCurrentViewDate: Dispatch<SetStateAction<Date>>;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  setFormData: Dispatch<SetStateAction<CalandarDataI>>;
  currentViewDate: Date;
  selectedDate: Date;
  dataList: CalandarDataI[];
  setActiveData: Dispatch<SetStateAction<CalandarDataI>>;
};

const RightCalandar = ({
  setCurrentViewDate,
  setSelectedDate,
  setFormData,
  currentViewDate,
  selectedDate,
  dataList,
  setActiveData,
}: RightCalandarProps) => {

  const handleChangeDate = (addYearVal: number, addMonthVal: number) => {
    setCurrentViewDate((prev) => {
      const updated = new Date(prev.getFullYear() + addYearVal, prev.getMonth() + addMonthVal, 1);
      setSelectedDate(updated);
      return updated;
    });
    setFormData({
      status: "default",
      title: "",
      description: "",
    });
    setActiveData({
      id: "",
      date: null,
      status: "",
      title: "",
      description: "",
      updatedAt: "",
    });
  }

  const handlePrevYear = () => {
    handleChangeDate(-1, 0);
  };

  const handleNextYear = () => {
    handleChangeDate(1, 0);
  };

  const handlePrevMonth = () => {
    handleChangeDate(0, -1);
  };

  const handleNextMonth = () => {
    handleChangeDate(0, 1);
  };

  return (
    <div className="w-full lg:w-[72%] flex flex-col gap-4">
      <Header
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        handlePrevYear={handlePrevYear}
        handleNextYear={handleNextYear}
        currentViewDate={currentViewDate}
      />
      <CalandarChart
        currentViewDate={currentViewDate}
        selectedDate={selectedDate}
        dataList={dataList}
        setSelectedDate={setSelectedDate}
        setFormData={setFormData}
        setActiveData={setActiveData}
      />
    </div>
  );
};

export default RightCalandar;
