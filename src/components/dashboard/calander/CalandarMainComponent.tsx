import { useEffect, useState } from "react";
import { type CalandarDataI } from "../../../types";
import { axiosPrivate } from "../../../api/axios";
import LeftDetails from "./left/LeftDetails";
import RightCalandar from "./right/RightCalandar";

const CalandarMainComponent = () => {
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());

  const month = currentViewDate.getMonth();
  const year = currentViewDate.getFullYear();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dataList, setDataList] = useState<CalandarDataI[]>([]);
  const [activeData, setActiveData] = useState<CalandarDataI>({
    id: "",
    date: null,
    status: "",
    title: "",
    description: "",
    updatedAt: "",
  });

  const handleGetRes = async () => {
    // setCreateLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/calandar?month=${month}&year=${year}`,
      );

      if (res?.data?.success) {
        const data = res?.data?.data;
        setDataList(data);
        const initialState = data.find((r: CalandarDataI) =>
          r.date
            ? new Date(r.date).getDate() === new Date()?.getDate()
            : {
                id: "",
                date: null,
                status: "",
                title: "",
                description: "",
                updatedAt: "",
              },
        );
        setActiveData(initialState);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setCreateLoading(false);
    }
  };

  useEffect(() => {
    handleGetRes();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-start mt-4 mb-3 gap-4 w-full">
      <LeftDetails
        activeData={activeData}
        setActiveData={setActiveData}
        setDataList={setDataList}
        selectedDate={selectedDate}
      />
      <RightCalandar
        setCurrentViewDate={setCurrentViewDate}
        setSelectedDate={setSelectedDate}
        currentViewDate={currentViewDate}
        selectedDate={selectedDate}
        dataList={dataList}
        setActiveData={setActiveData}
      />
    </div>
  );
};

export default CalandarMainComponent;
