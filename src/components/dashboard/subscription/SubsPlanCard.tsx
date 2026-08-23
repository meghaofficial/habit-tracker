import { type Dispatch, type SetStateAction } from "react";
import { formattedText } from "../../../helper";
import type { PlanI } from "../../../types";
import { CustomButtonForm } from "../../shared/CutomButton";

const SubsPlanCard = ({
  plan,
  len,
  setOpenPopup,
  handleSubscribe
}: {
  plan: PlanI;
  len: number;
  setOpenPopup: Dispatch<SetStateAction<boolean>>;
  handleSubscribe: (planID: string, amount: number) => Promise<void>;
}) => {

  return (
    <div
      key={plan?._id}
      className="p-3 flex items-center justify-center w-full"
    >
      <div className=" group relative w-full max-w-105 overflow-hidden rounded-[28px] border border-white/8 bg-linear-to-b from-zinc-900 via-zinc-950 to-black p-7 transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/30 hover:shadow-[0_25px_80px_rgba(99,102,241,0.15)] ">
        {/* Ambient glow */}
        <div className=" pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-700 group-hover:bg-indigo-500/20 " />

        <div className=" pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl " />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Membership
                </p>
              </div>

              <h3 className="text-3xl font-bold tracking-tight text-white">
                {formattedText(plan?.planName)}
              </h3>
            </div>

            {/* Plan badge */}
            <div className="rounded-full border border-indigo-400/10 bg-indigo-400/10 px-3 py-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                Plan
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-8">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black tracking-tight text-white">
                ₹{plan?.amount}
              </span>

              <span className="mb-2 text-xs text-zinc-500">full amount</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-5 min-h-18 text-sm leading-6 text-zinc-400">
            {plan?.description}
          </p>

          {/* Divider */}
          <div className="my-7 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

          {/* Included */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              What's included
            </p>

            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10">
                <svg
                  className="h-3 w-3 text-indigo-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <span className="text-sm text-zinc-300">
                Full access to your membership features
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10">
                <svg
                  className="h-3 w-3 text-indigo-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <span className="text-sm text-zinc-300">
                Personalized experience
              </span>
            </div>
          </div>

          <div className="mt-8">
            <CustomButtonForm
              type="success"
              styling="w-full h-12 !rounded-xl"
              onClick={() => {
                if (len > 1) {
                  handleSubscribe(plan?._id, plan?.amount);
                } else {
                  setOpenPopup(true);
                }
              }}
            >
              <span className="flex items-center justify-center gap-2">
                Activate Plan
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </CustomButtonForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsPlanCard;
