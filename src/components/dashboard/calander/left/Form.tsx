import { motion } from "framer-motion";
import { formatTimestamp, notify } from "../../../../helper";
import { statusColors, type CalandarDataI } from "../../../../types";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { RootState } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import CircleLoader from "../../../loaders/CircleLoader";
import { axiosPrivate } from "../../../../api/axios";

type FormProps = {
  activeData: CalandarDataI;
  setActiveData: Dispatch<SetStateAction<CalandarDataI>>;
  setToggleUpdate: Dispatch<SetStateAction<boolean>>;
  selectedDate: Date;
  setDataList: Dispatch<SetStateAction<CalandarDataI[]>>;
};

const Form = ({
  activeData,
  setActiveData,
  setToggleUpdate,
  selectedDate,
  setDataList,
}: FormProps) => {
  const theme = useSelector((state: RootState) => state.theme).theme;
  const [formData, setFormData] = useState<CalandarDataI>({
    status: "default",
    title: "",
    description: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("default");

  const handleCreate = async () => {
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
          status: "default",
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-blue-500/20">
          {activeData?.id ? "Edit Task" : "New Task"}
        </span>
        <span className="text-xs font-semibold px-3 py-1 bg-white/5 rounded-full border border-white/10">
          {formatTimestamp(selectedDate.toString()).split("|")[0]}
        </span>
      </div>

      {/* Status Selection */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold opacity-60 tracking-wider uppercase">
          Select Status
        </p>
        <div className="flex flex-wrap gap-2.5">
          {Object.entries(statusColors).map(([key, value], index) => {
            const currentStatus = activeData?.id
              ? activeData?.status
              : activeData;
            const selected = currentStatus === key;

            return (
              <button
                key={index}
                onClick={() => {
                  if (activeData?.id) {
                    setActiveData((prev) =>
                      prev ? { ...prev, status: key } : prev,
                    );
                  } else {
                    setActiveStatus(key);
                    setFormData((prev) => ({ ...prev, status: key }));
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-300 ${selected ? "scale-105 shadow-lg ring-1 ring-white/20" : "hover:scale-105 hover:bg-white/5 opacity-70 hover:opacity-100"}`}
                style={{
                  backgroundColor: selected
                    ? theme === "dark"
                      ? value.dbg
                      : value.bg
                    : "transparent",
                  border: `1px solid ${selected ? (theme === "dark" ? value.ddot : value.dot) : theme === "dark" ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
                  boxShadow: selected
                    ? `0 4px 12px ${theme === "dark" ? value.ddot + "40" : value.dot + "30"}`
                    : "none",
                }}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${selected ? "animate-pulse" : ""}`}
                  style={{
                    backgroundColor: theme === "dark" ? value.ddot : value.dot,
                  }}
                />
                <span className="capitalize">{key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold opacity-60 tracking-wider uppercase">
          Title
        </label>
        <div className="relative group">
          <input
            type="text"
            placeholder={
              activeData?.id
                ? activeData?.title
                : "What do you want to accomplish?"
            }
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:bg-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 placeholder:text-gray-500"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold opacity-60 tracking-wider uppercase">
          Description
        </label>
        <textarea
          placeholder={
            activeData?.id
              ? activeData?.description
              : "Add some details about this task..."
          }
          className="h-40 resize-none w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:bg-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 placeholder:text-gray-500"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        {activeData?.id && (
          <button
            disabled={createLoading}
            className="flex-1 px-6 py-3.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all active:scale-95"
            onClick={() => setToggleUpdate(false)}
          >
            Cancel
          </button>
        )}
        <button
          disabled={activeData?.id ? updateLoading : createLoading}
          className="flex-2 px-6 py-3.5 text-sm bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 border border-purple-500/50"
          onClick={activeData?.id ? handleUpdate : handleCreate}
        >
          {createLoading || updateLoading ? (
            <CircleLoader />
          ) : (
            <>
              <span>{activeData?.id ? "Save Changes" : "Create Task"}</span>
              {!activeData?.id && (
                <span className="text-lg leading-none">+</span>
              )}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Form;
