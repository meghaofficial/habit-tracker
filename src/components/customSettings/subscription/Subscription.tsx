import { useEffect, useState } from "react";
import type { PlanI, SubsList } from "../../../types";
import { axiosPrivate } from "../../../api/axios";
import ActivePlan from "./ActivePlan";
import PlansGrid from "./PlansGrid";
import SubscriptionList from "./SubscriptionList";
import { FiCreditCard } from "react-icons/fi";

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
     <div className="space-y-7">
      
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-white/6 pb-5 light:border-black/6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10">
          <FiCreditCard className="h-4 w-4 text-indigo-400" />
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white light:text-black">
            Billing & Subscriptions
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Manage your membership, plans and subscription
            history.
          </p>
        </div>
      </div>

      {/* Content */}
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

        {/* Subscription History */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SubscriptionList
            type="scheduled"
            loading={allSubsLoading}
            list={scheduledList}
          />

          <SubscriptionList
            type="expired"
            loading={allSubsLoading}
            list={expiredList}
          />
        </div>
      </div>
    </div>
  );
};

export default Subscription;
