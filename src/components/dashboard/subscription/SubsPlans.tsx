import type { PlanI } from "../../../types";
import SubsPlanCard from "./SubsPlanCard";
import type { Dispatch, SetStateAction } from "react";

const SubsPlans = ({
  showFree,
  plansList,
  setOpenPopup,
  setOpenPlan,
  setShowDashboard,
  getActiveSubscription,
  handleSubscribe
}: {
  showFree: boolean;
  plansList: PlanI[];
  setOpenPopup: Dispatch<SetStateAction<boolean>>;
  setOpenPlan: Dispatch<SetStateAction<boolean>>;
  setShowDashboard: Dispatch<SetStateAction<boolean>>;
  getActiveSubscription: () => Promise<void>;
  handleSubscribe: (planID: string, amount: number) => Promise<void>;
}) => {
  return (
    <div className="relative mb-5">
      <p className="sm:text-3xl text-2xl sm:mt-0 mt-5 mb-3 font-semibold text-center sm:px-0 px-5">
        Oops! you don't have any active subscription.
      </p>
      <p className="sm:mb-5 mb-1 text-center sm:px-0 px-8">
        To activate, please choose any active plan from the following.
      </p>
      <div
        className={`grid gap-3 ${showFree ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
      >
        {plansList.map((plan) => (
          <SubsPlanCard
            plan={plan}
            len={plansList.length}
            setOpenPopup={setOpenPopup}
            setOpenPlan={setOpenPlan}
            setShowDashboard={setShowDashboard}
            getActiveSubscription={getActiveSubscription}
            handleSubscribe={handleSubscribe}
          />
        ))}
      </div>
    </div>
  );
};

export default SubsPlans;
