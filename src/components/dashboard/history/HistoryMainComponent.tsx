import React from "react";
import Card from "../../shared/Card";
import { useState } from "react";
import { type SubscriptionI } from "../../../types";

const HistoryMainComponent = () => {

  const [subs, setSubs] = useState<SubscriptionI[]>([
    { _id: "1",  }
  ]);

  return (
    <div className="flex items-start mt-4 mb-3 gap-3">
      {/* WORKING ON THIS */}
      <Card
        heading="Select Month"
        cardWidth="w-1/4"
        bodyHeight="h-[702px]"
      >
        <div className="flex items-center justify-center mt-3 overflow-y-auto"></div>
      </Card>
      {/* 





TILL HERE




       */}
      <div className="w-3/4">
        <Card heading="" cardWidth="w-full">
          <div className="flex items-center justify-between"></div>
        </Card>

        {/* Main Calandar */}
        <Card heading="" cardWidth="w-full" styling="mt-3">
          <div className="relative w-full px-1.5"></div>
        </Card>
      </div>
    </div>
  );
};

export default HistoryMainComponent;
