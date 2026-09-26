import { useEffect, useState } from "react";
import { type CalandarDataI } from "../../../types";
import { axiosPrivate } from "../../../api/axios";
import LeftDetails from "./LeftDetails";
import RightCalandar from "./RightCalandar";

const CalandarMainComponent = () => {
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());
  const month = currentViewDate.getMonth();
  const year = currentViewDate.getFullYear();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<CalandarDataI>({
    title: "",
    description: "",
    tag: "",
    color: "",
  }); // what we are writing
  const [dataList, setDataList] = useState<CalandarDataI[]>([]);
  const [activeData, setActiveData] = useState<CalandarDataI>({
    id: "",
    date: null,
    title: "",
    description: "",
    updatedAt: "",
    tag: "",
    color: "",
  }); // for api response & when user clicks
  const [loading, setLoading] = useState(false);
  const [toggleUpdate, setToggleUpdate] = useState(false);

  const handleGetRes = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetRes();
    setToggleUpdate(false);
  }, [currentViewDate]);

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start sm:mt-4 mt-3 mb-3 sm:gap-4 gap-3 w-full">
      <LeftDetails
        activeData={activeData}
        setActiveData={setActiveData}
        setDataList={setDataList}
        selectedDate={selectedDate}
        formData={formData}
        setFormData={setFormData}
        toggleUpdate={toggleUpdate}
        setToggleUpdate={setToggleUpdate}
      />
      <RightCalandar
        setCurrentViewDate={setCurrentViewDate}
        setSelectedDate={setSelectedDate}
        setFormData={setFormData}
        currentViewDate={currentViewDate}
        selectedDate={selectedDate}
        dataList={dataList}
        setActiveData={setActiveData}
        loading={loading}
        setToggleUpdate={setToggleUpdate}
      />
    </div>
  );
};

export default CalandarMainComponent;
