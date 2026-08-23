import { CustomButtonForm } from "../../shared/CutomButton";
import CircleLoader from "../../loaders/CircleLoader";
import type { Dispatch, SetStateAction } from "react";

const FreeSubsConfirm = ({
  setOpenPopup,
  handleSubscribe,
  loading,
}: {
  setOpenPopup: Dispatch<SetStateAction<boolean>>;
  handleSubscribe: () => Promise<void>;
  loading: boolean;
}) => {
  return (
    <div className="px-5">
      <div className="relative transition-transform duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(99,102,241,0.12)] rounded-[28px] bg-black mb-5 light:bg-white border border-white/10 p-8 hide-scrollbar">
        <div className="relative">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-center text-2xl font-bold">
            Activate Free Trial
          </h2>
          <p className="mt-3 text-center text-darkSubText">
            This action can only be used once and cannot be reversed.
          </p>
          <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <p className="text-sm font-semibold text-yellow-400">Important</p>
            <p className="mt-3 text-sm leading-7 text-darkSubText">
              Your free trial remains active only until the end of the current
              month, regardless of the activation date.
            </p>
            <div className="mt-4 rounded-xl bg-black/20 p-4 text-sm text-gray-400">
              <strong>Example:</strong>
              <ul className="mt-2 space-y-2">
                <li>• Activate on April 4 → valid until April 30</li>
                <li>• Activate on April 25 → valid until April 30</li>
              </ul>
            </div>
            <p className="mt-4 text-sm text-yellow-300">
              For maximum benefit, activate near the beginning of a month.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <CustomButtonForm
              type="cancel"
              styling="w-1/2"
              onClick={() => setOpenPopup(false)}
            >
              Cancel
            </CustomButtonForm>
            <CustomButtonForm
              type="success"
              styling="w-1/2"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? <CircleLoader /> : "Activate Trial"}
            </CustomButtonForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeSubsConfirm;
