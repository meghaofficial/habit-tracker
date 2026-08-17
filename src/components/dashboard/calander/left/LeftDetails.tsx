import Card from "../../../shared/Card";
import { type CalandarDataI } from "../../../../types";
import Details from "./Details";
import { useState, type Dispatch, type SetStateAction } from "react";
import Form from "./Form";

type LeftDetailsProps = {
  activeData: CalandarDataI;
  setActiveData: Dispatch<SetStateAction<CalandarDataI>>;
  setDataList: Dispatch<SetStateAction<CalandarDataI[]>>;
  selectedDate: Date;
};

const LeftDetails = ({
  activeData,
  setActiveData,
  setDataList,
  selectedDate,
}: LeftDetailsProps) => {
  const [toggleUpdate, setToggleUpdate] = useState(false);

  return (
    <Card
      heading=""
      cardWidth="w-full lg:w-[28%]"
      bodyHeight="h-auto "
    >
      <div className="space-y-6 overflow-y-auto overflow-x-hidden p-2">
        {activeData?.id && !toggleUpdate ? (
          <Details
            activeData={activeData}
            setActiveData={setActiveData}
            setDataList={setDataList}
            setToggleUpdate={setToggleUpdate}
            selectedDate={selectedDate}
          />
        ) : (
          <Form
            activeData={activeData}
            setActiveData={setActiveData}
            setToggleUpdate={setToggleUpdate}
            selectedDate={selectedDate}
            setDataList={setDataList}
          />
        )}
      </div>
    </Card>
  );
};

export default LeftDetails;
