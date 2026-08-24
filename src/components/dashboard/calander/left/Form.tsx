import { motion } from "framer-motion";
import { formatTimestamp, notify } from "../../../../helper";
import { statusColors, type CalandarDataI } from "../../../../types";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { RootState } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import CircleLoader from "../../../loaders/CircleLoader";
import { axiosPrivate } from "../../../../api/axios";
import { CustomButtonForm } from "../../../shared/CutomButton";

type FormProps = {
  activeData: CalandarDataI;
  setActiveData: Dispatch<SetStateAction<CalandarDataI>>;
  setToggleUpdate: Dispatch<SetStateAction<boolean>>;
  selectedDate: Date;
  setDataList: Dispatch<SetStateAction<CalandarDataI[]>>;
  formData: CalandarDataI;
  setFormData: Dispatch<SetStateAction<CalandarDataI>>;
};

const Form = ({
  activeData,
  setActiveData,
  setToggleUpdate,
  selectedDate,
  setDataList,
  formData,
  setFormData,
}: FormProps) => {
  const theme = useSelector((state: RootState) => state.theme).theme;
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("");

  const handleCreate = async () => {
    if (!formData?.title || !formData?.status) return;
    setCreateLoading(true);
    try {
      const res = await axiosPrivate.post("/api/calandar", {
        day: Number(selectedDate.getDate()),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
        status: formData.status,
        title: formData.title,
        description: formData.description,
      });

      if (res?.data?.success) {
        const newTask = res.data.data;
        setDataList((prev) => [...prev, newTask]);
        setActiveData(newTask);
        setFormData({
          status: "",
          title: "",
          description: "",
        });
        return notify.success("Successfully Added");
      }
    } catch (error) {
      console.error(error);
      if ((error as any).response?.status === 409) {
        notify.error((error as any).response.data.message);
      } else {
        notify.error("Something went wrong");
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    try {
      const res = await axiosPrivate.patch("/api/calandar", {
        id: activeData?.id,
        status: formData.status,
        title: formData.title,
        description: formData.description,
      });

      if (res?.data?.success) {
        const updatedTask = res.data.data;
        setDataList((prev) =>
          prev.map((item) => (item.id === updatedTask.id ? updatedTask : item)),
        );
        setActiveData(updatedTask);
        setToggleUpdate(false);
        return notify.success("Successfully Updated");
      }
    } catch (error) {
      console.error(error);
      if ((error as any).response?.status === 409) {
        notify.error((error as any).response.data.message);
      } else {
        notify.error("Something went wrong");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (activeData) {
      setFormData((prev) => ({
        ...prev,
        title: activeData?.title,
        description: activeData?.description,
      }));
    }
  }, [activeData]);

  useEffect(() => {
    if (!activeData?.id) {
      setActiveStatus("default");
    } else {
      setActiveStatus(activeData?.status);
    }
  }, [activeData?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
              {activeData?.id ? "Edit Task" : "New Task"}
            </span>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <span className="text-[10px] text-gray-500">
              {formatTimestamp(selectedDate.toString()).split("|")[0]}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-semibold tracking-tight text-white light:text-lightText">
            {activeData?.id ? "Update your task" : "Create a new task"}
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-gray-500">
            {activeData?.id
              ? "Make changes to keep your plan up to date."
              : "Define something meaningful you want to accomplish."}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-indigo-400">
          ✦
        </div>
      </div>

      <div className="h-px bg-white/[0.07]" />

      {/* Status */}
      <div className="mt-5">
        <div className="mb-2.5 flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
            Status
          </label>

          <span className="text-[10px] text-gray-600">Choose one</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(statusColors).map(([key, value], index) => {
            const isActive = activeStatus === key;

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setActiveStatus(key);
                  setFormData((prev) => ({
                    ...prev,
                    status: key,
                  }));
                }}
                className={`
              flex items-center gap-2 rounded-xl border px-3 py-2
              text-[10px] font-medium capitalize
              transition-all duration-200
              ${
                isActive
                  ? "shadow-[0_6px_20px_rgba(99,102,241,0.12)]"
                  : "border-white/8 bg-white/2 text-gray-500 hover:border-white/15 hover:bg-white/5 hover:text-gray-300"
              }
            `}
                style={{
                  backgroundColor: isActive
                    ? theme === "dark"
                      ? value.dbg
                      : value.bg
                    : undefined,

                  borderColor: isActive
                    ? theme === "dark"
                      ? value.ddot
                      : value.dot
                    : undefined,

                  color: isActive
                    ? theme === "dark"
                      ? value.ddot
                      : value.dot
                    : undefined,
                }}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: theme === "dark" ? value.ddot : value.dot,
                  }}
                />

                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="mt-6">
        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
          Task title
        </label>

        <input
          type="text"
          placeholder={
            activeData?.id
              ? activeData?.title
              : "What do you want to accomplish?"
          }
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="
        mt-2
        h-11
        w-full
        rounded-xl
        border
        border-white/10
        bg-white/[0.035]
        px-3.5
        text-[12px]
        text-white
        outline-none
        transition-all
        duration-200
        placeholder:text-gray-600
        hover:border-white/15
        focus:border-indigo-500/40
        focus:bg-white/5
        focus:ring-4
        focus:ring-indigo-500/[0.07]
        light:text-lightText
      "
        />
      </div>

      {/* Description */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
            Description
          </label>

          <span className="text-[9px] text-gray-600">Optional</span>
        </div>

        <textarea
          placeholder={
            activeData?.id
              ? activeData?.description
              : "Add some details about this task..."
          }
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="
        mt-2
        h-36
        w-full
        resize-none
        rounded-xl
        border
        border-white/10
        bg-white/[0.035]
        px-3.5
        py-3
        text-[12px]
        leading-6
        text-white
        outline-none
        transition-all
        duration-200
        placeholder:text-gray-600
        hover:border-white/15
        focus:border-indigo-500/40
        focus:bg-white/5
        focus:ring-4
        focus:ring-indigo-500/[0.07]
        light:text-lightText
      "
        />
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-2.5 border-t border-white/[0.07] pt-5">
        {activeData?.id && (
          <CustomButtonForm
            styling="h-10 flex-1 cursor-pointer"
            onClick={() => setToggleUpdate(false)}
            type="cancel"
          >
            <span className="text-[11px] font-semibold">Cancel</span>
          </CustomButtonForm>
        )}

        <CustomButtonForm
          styling="h-10 flex-1 cursor-pointer"
          onClick={activeData?.id ? handleUpdate : handleCreate}
          disabled={updateLoading || createLoading || !formData.title}
          type="success"
        >
          {createLoading || updateLoading ? (
            <CircleLoader />
          ) : (
            <span className="text-[11px] font-semibold">
              {activeData?.id ? "Save Changes" : "Create Task"}
            </span>
          )}
        </CustomButtonForm>
      </div>
    </motion.div>
  );
};

export default Form;
