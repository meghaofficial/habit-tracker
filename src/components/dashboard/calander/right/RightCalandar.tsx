import { useState, type Dispatch, type SetStateAction } from "react";
import CalandarChart from "./CalandarChart";
import Header from "./Header";
import type { CalandarDataI } from "../../../../types";

type RightCalandarProps = {
  setCurrentViewDate: Dispatch<SetStateAction<Date>>;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  currentViewDate: Date;
  selectedDate: Date;
  dataList: CalandarDataI[];
  setActiveData: Dispatch<SetStateAction<CalandarDataI>>;
};

const RightCalandar = ({
  setCurrentViewDate,
  setSelectedDate,
  currentViewDate,
  selectedDate,
  dataList,
  setActiveData,
}: RightCalandarProps) => {

    const [formData, setFormData] = useState<CalandarDataI>({
      status: "default",
      title: "",
      description: "",
    });

  const handlePrevYear = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1),
    );
    setSelectedDate(new Date());
    setFormData({
      status: "default",
      title: "",
      description: "",
    });
  };

  const handleNextYear = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1),
    );
    setSelectedDate(new Date());
    setFormData({
      status: "default",
      title: "",
      description: "",
    });
  };

  const handlePrevMonth = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
    setSelectedDate(new Date());
    setFormData({
      status: "default",
      title: "",
      description: "",
    });
  };

  const handleNextMonth = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
    setSelectedDate(new Date());
    setFormData({
      status: "default",
      title: "",
      description: "",
    });
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
