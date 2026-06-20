import React, { useState, useEffect } from "react";
import CustomButton from "../shared/CutomButton";
import { axiosPrivate } from "../../api/axios";
import { formatMonthYearSimple } from "../../helper";
import { CustomButtonForm } from "../shared/CutomButton";
import type { PlanI } from "../../types";
import { formattedText } from "../../helper";
import { notify } from "../../helper";
import CircleLoader from "../loaders/CircleLoader";

interface SubsList {
  _id: string;
  planType: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

const Subscription = () => {
  const [activeSubsLoading, setActiveSubsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [plansList, setPlansList] = useState<PlanI[]>([]);
  const [showPlans, setShowPlans] = useState(false);
  const [getPlanLoading, setGetPlanLoading] = useState(false);
  const [freeTrialLoading, setFreeTrialLoading] = useState("");
  const [allSubsLoading, setAllSubsLoading] = useState(false);

  const [scheduledList, setScheduledList] = useState<SubsList[]>([]);
  const [expiredList, setExpiredList] = useState<SubsList[]>([]);

  const getActiveSubscription = async () => {
    setActiveSubsLoading(true);
    try {
      const res = await axiosPrivate.get("/api/active-subscription");
      if (res?.data?.success) {
        const subscription = res?.data?.subscription;
        setStartDate(subscription?.startDate);
        setEndDate(subscription?.endDate);
      }
    } catch (error) {
      if ((error as any).response.status === 500) {
        // setFallback(true);
      }
    } finally {
      setActiveSubsLoading(false);
    }
  };

  const getPlans = async () => {
    setGetPlanLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-plans?type=paid`);
      if (res?.data?.success) {
        setPlansList(res?.data?.plans || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGetPlanLoading(false);
    }
  };

  const handleSubscribe = async (planID: string, amount: number) => {
    setFreeTrialLoading(planID);
    try {
      const res = await axiosPrivate.post("/api/subscribe", { planID, amount });
      if (res?.data?.success) {
        notify.success(res?.data?.message);
        setShowPlans(false);
      }
    } catch (error) {
      notify.error((error as any).response.data.message);
    } finally {
      setFreeTrialLoading("");
    }
  };

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
    getActiveSubscription();
  }, []);

  useEffect(() => {
    getAllSubs();
  }, [scheduledList]);

  return (
    <>
      <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4">
        <div>
          <p className="mb-1 font-semibold">Active Plan</p>
          <p className="text-[13px] text-gray-500">
            {formatMonthYearSimple(startDate)} -{" "}
            {formatMonthYearSimple(endDate)}
          </p>
        </div>
        {showPlans ? (
          <button
            className="px-4 py-2 bg-green-500 rounded-lg text-[12px] text-black font-semibold hover:bg-green-600"
            onClick={() => setShowPlans(false)}
          >
            Hide Plans
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-500 rounded-lg text-[12px] text-black font-semibold hover:bg-green-600"
            onClick={() => {
              setShowPlans(true);
              getPlans();
            }}
          >
            Extend Plan
          </button>
        )}
      </div>
      {showPlans &&
        (getPlanLoading ? (
          <div className="animate-pulse rounded-2xl h-50 w-full bg-white/5 light:bg-black/5 mt-5"></div>
        ) : (
          <div className="grid grid-cols-4 gap-3 bg-white/5 light:bg-black/5 border border-white/10 rounded-2xl p-4 mt-5">
            {plansList?.map((plan, index) => (
              <div key={index} className="h-full">
                <div
                  key={index}
                  className="group h-full relative overflow-hidden w-full rounded-2xl border border-white/10 bg-black px-6 py-4 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(99,102,241,0.12)]"
                >
                  <div className="relative z-10">
                    <h3 className="mt-2 font-bold">
                      {formattedText(plan?.planName)}
                    </h3>
                    <div className="mt-2 flex items-end gap-1">
                      <span className="text-2xl font-black">
                        ₹{plan?.amount}
                      </span>
                      <span className="text-gray-500 text-[12px] mb-1 ms-1">
                        Full Amount
                      </span>
                    </div>
                    <p className="mt-5 h-20 text-[12px] leading-7 text-darkSubText light:text-black">
                      {plan?.description}
                    </p>
                    <div className="my-6 h-px bg-white/10" />
                    <CustomButtonForm
                      type="success"
                      styling="w-1/2"
                      onClick={() => {
                        if (freeTrialLoading === plan._id) return;
                        handleSubscribe(plan?._id, plan?.amount);
                      }}
                    >
                      {freeTrialLoading === plan._id ? (
                        <CircleLoader />
                      ) : (
                        "Activate Plan"
                      )}
                    </CustomButtonForm>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      <div className="flex gap-3 mt-5">
        <div className="bg-red-500/5 w-full border border-red-500/10 rounded-2xl p-4">
          <h1 className="font-semibold text-red-500">Expired Subscriptions</h1>
          <div className="mt-2">
            {expiredList?.map((exp, index) => (
              <div className="flex items-center justify-between mt-2" key={index}>
                <p className="text-[12px]">
                  {formatMonthYearSimple(exp?.startDate)} -{" "}
                  {formatMonthYearSimple(exp?.endDate)}
                </p>
                <p className="text-[12px] capitalize">{exp?.planType}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-yellow-500/5 w-full border border-yellow-500/10 rounded-2xl p-4">
          <h1 className="font-semibold text-yellow-500">
            Scheduled Subscriptions
          </h1>
          <div className="mt-2">
            {scheduledList?.map((sch, index) => (
              <div className="flex items-center justify-between mt-2" key={index}>
                <p className="text-[12px]">
                  {formatMonthYearSimple(sch?.startDate)} -{" "}
                  {formatMonthYearSimple(sch?.endDate)}
                </p>
                <p className="text-[12px] capitalize">{sch?.planType}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <h1 className="text-xl font-semibold mt-6 mb-4">
        {activeSubsTab} Subscription
      </h1> */}
    </>
  );
};

export default Subscription;
