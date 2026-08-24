import { useEffect, useState } from "react";
import type { PlanI, SubsList } from "../../../types";
import { axiosPrivate } from "../../../api/axios";
import ActivePlan from "./ActivePlan";
import PlansGrid from "./PlansGrid";
import SubscriptionList from "./SubscriptionList";

const Subscription = () => {
  const [plansList, setPlansList] = useState<PlanI[]>([]);
  const [showPlans, setShowPlans] = useState(false);
  const [getPlanLoading, setGetPlanLoading] = useState(false);
  const [allSubsLoading, setAllSubsLoading] = useState(false);
  const [scheduledList, setScheduledList] = useState<SubsList[]>([]);
  const [expiredList, setExpiredList] = useState<SubsList[]>([]);

  const getAllSubs = async () => {
    setAllSubsLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/all-subscriptions`);
      if (res?.data?.success) {
        const list = res?.data?.subscriptions || [];
        const sch = list?.filter((d: SubsList) => d?.status === "scheduled");
        const exp = list?.filter((d: SubsList) => d?.status === "expired");
        setScheduledList(sch);
        setExpiredList(exp);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAllSubsLoading(false);
    }
  };

  useEffect(() => {
    getAllSubs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 light:border-black/10 pb-4">
        <h3 className="text-xl font-bold text-white light:text-black">
          Billing & Subscriptions
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Manage your premium membership plans and history.
        </p>
      </div>
      <div className="mt-4">
        <div className="space-y-5">
          <ActivePlan
            showPlans={showPlans}
            setGetPlanLoading={setGetPlanLoading}
            setPlansList={setPlansList}
            setShowPlans={setShowPlans}
          />
          <PlansGrid
            showPlans={showPlans}
            getPlanLoading={getPlanLoading}
            plansList={plansList}
            setShowPlans={setShowPlans}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <SubscriptionList
              type="expired"
              loading={allSubsLoading}
              list={expiredList}
            />
            <SubscriptionList
              type="expired"
              loading={allSubsLoading}
              list={scheduledList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
