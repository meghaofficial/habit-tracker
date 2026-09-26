import Card from "../../shared/Card";
import { type CalandarDataI } from "../../../types";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { axiosPrivate } from "../../../api/axios";
import { formatTimestamp, notify } from "../../../helper";
import { MdDelete, MdEdit } from "react-icons/md";
import CircleLoader from "../../loaders/CircleLoader";
import { motion } from "framer-motion";
import { CustomButtonForm } from "../../shared/CutomButton";
import TagColorPicker from "./TagColorPicker";

type LeftDetailsProps = {
  activeData: CalandarDataI;
  setActiveData: Dispatch<SetStateAction<CalandarDataI>>;
  setDataList: Dispatch<SetStateAction<CalandarDataI[]>>;
  selectedDate: Date;
  formData: CalandarDataI;
  setFormData: Dispatch<SetStateAction<CalandarDataI>>;
  toggleUpdate: boolean;
  setToggleUpdate: Dispatch<SetStateAction<boolean>>;
};

const LeftDetails = ({
  activeData,
  setActiveData,
  setDataList,
  selectedDate,
  formData,
  setFormData,
  toggleUpdate,
  setToggleUpdate,
}: LeftDetailsProps) => {
  // const theme = useSelector((state: RootState) => state.theme).theme;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const todayStrArr = formatTimestamp(selectedDate?.toString())
    ?.split("|")[0]
    ?.split("-");

  const handleCreate = async () => {
    if (!formData?.title || !formData?.color) return;
    setCreateLoading(true);
    try {
      const res = await axiosPrivate.post("/api/calandar", {
        day: Number(selectedDate.getDate()),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
        tag: formData.tag,
        color: formData.color,
        title: formData.title,
        description: formData.description,
      });

      if (res?.data?.success) {
        const newTask = res.data.data;
        setDataList((prev) => [...prev, newTask]);
        setActiveData(newTask);
        setFormData({
          tag: "",
          color: "",
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
        tag: formData.tag,
        color: formData.color,
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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeleteLoading(true);
    try {
      const res = await axiosPrivate.delete("/api/calandar", {
        data: { id: activeData?.id },
      });

      if (res?.data?.success) {
        setDataList((prev: CalandarDataI[]) =>
          prev.filter((item: CalandarDataI) => item.id !== activeData?.id),
        );
        setActiveData({
          id: "",
          date: null,
          tag: "",
          color: "",
          title: "",
          description: "",
          updatedAt: "",
        });
        return notify.success("Successfully Deleted");
      }
    } catch (error) {
      console.error(error);
      notify.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChangeValue = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!activeData) return;

    setFormData((prev) => ({
      ...prev,
      title: activeData.title ?? "",
      description: activeData.description ?? "",
      tag: activeData.tag ?? "",
      color: activeData.color || "#E05555",
    }));
  }, [activeData]);

  return (
    <Card heading="" cardWidth="w-full lg:w-[28%]" bodyHeight="h-auto ">
      <div className="space-y-6 overflow-y-auto overflow-x-hidden p-2">
        {activeData?.id && !toggleUpdate ? (
          // Details
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:h-full"
          >
            {/* Date and actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/15 bg-indigo-500/6 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
                <span className="text-2xl font-semibold leading-none tracking-tight text-indigo-300 sm:text-3xl light:text-indigo-600">
                  {todayStrArr[0]}
                </span>

                <div className="flex flex-col gap-0.5 border-l border-indigo-400/20 pl-2 sm:pl-3">
                  <span className="text-[11px] font-semibold text-white/80 sm:text-xs light:text-black/75">
                    {todayStrArr[1]}
                  </span>

                  <span className="text-[9px] font-medium tracking-wider text-white/40 sm:text-[10px] light:text-black/45">
                    {todayStrArr[2]}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setToggleUpdate(true)}
                  title="Edit event"
                  aria-label="Edit event"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/4 text-white/60 transition-colors hover:bg-white/8 hover:text-white light:border-black/10 light:bg-black/2.5 light:text-black/60 light:hover:bg-black/5"
                >
                  <MdEdit size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  title="Delete event"
                  aria-label="Delete event"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/10 bg-red-500/6 text-red-400 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteLoading ? <CircleLoader /> : <MdDelete size={16} />}
                </button>
              </div>
            </div>

            {/* Event details */}
            <div
              className="mt-3 overflow-hidden rounded-xl border sm:mt-5 sm:rounded-2xl"
              style={{
                borderColor: `${activeData.color || "#6366F1"}30`,
                backgroundColor: `${activeData.color || "#6366F1"}08`,
              }}
            >
              <div className="p-3 sm:p-4">
                {activeData.tag && (
                  <span
                    className="mb-2 inline-block max-w-full wrap-break-word rounded-md px-2 py-0.5 text-[9px] font-semibold sm:mb-3 sm:py-1 sm:text-[10px]"
                    style={{
                      color: activeData.color || "#6366F1",
                      backgroundColor: `${activeData.color || "#6366F1"}18`,
                    }}
                  >
                    {activeData.tag}
                  </span>
                )}

                <h2 className="wrap-break-word text-[13px] font-semibold leading-relaxed text-white/90 sm:text-[14px] light:text-black/85">
                  {activeData.title}
                </h2>

                {activeData.description && (
                  <div className="mt-2.5 border-t border-white/6 pt-2.5 sm:mt-4 sm:pt-4 light:border-black/6">
                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35 sm:mb-2 light:text-black/40">
                      Notes
                    </p>

                    <p className="whitespace-pre-wrap wrap-break-word text-[12px] leading-5 text-white/60 sm:leading-6 light:text-black/65">
                      {activeData.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Last updated */}
            {activeData.updatedAt && (
              <div className="pt-3 sm:mt-auto sm:pt-5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/6 pt-2 text-[9px] sm:gap-2 sm:pt-3 sm:text-[10px] light:border-black/6">
                  <span className="text-white/35 light:text-black/40">
                    Last updated
                  </span>

                  <span className="text-white/55 light:text-black/60">
                    {formatTimestamp(activeData.updatedAt.toString())}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          // Form
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Header */}
            <div className="pb-3 sm:pb-5">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-start">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-400 sm:text-[10px] sm:tracking-[0.2em]">
                  {activeData?.id ? "Edit Task" : "New Task"}
                </span>

                <span className="text-[9px] text-gray-500 sm:text-[10px]">
                  {formatTimestamp(selectedDate.toString()).split("|")[0]}
                </span>
              </div>

              <h3 className="mt-1 text-sm font-semibold tracking-tight text-white sm:mt-2 sm:text-lg light:text-lightText">
                {activeData?.id ? "Update your task" : "Create a new task"}
              </h3>

              <p className="mt-1 hidden text-[11px] leading-5 text-gray-500 sm:block">
                {activeData?.id
                  ? "Make changes to keep your plan up to date."
                  : "Define something meaningful you want to accomplish."}
              </p>
            </div>

            <div className="h-px bg-white/[0.07] light:bg-black/[0.07]" />

            {/* Tag */}
            <div className="mt-3 sm:mt-5">
              <div className="mb-1.5 flex items-center justify-between sm:mb-2.5">
                <label className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-500 sm:text-[10px] sm:tracking-[0.18em]">
                  Tag
                </label>

                <span className="hidden text-[10px] text-gray-600 sm:inline">
                  Choose one
                </span>
              </div>

              <TagColorPicker
                tag={formData?.tag || ""}
                selectedColor={formData?.color || ""}
                setFormData={setFormData}
              />
            </div>

            {/* Title */}
            <div className="mt-3">
              <label
                htmlFor="calendar-title"
                className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-500 sm:text-[10px] sm:tracking-[0.18em]"
              >
                Title
              </label>

              <input
                id="calendar-title"
                type="text"
                placeholder={
                  activeData?.id
                    ? activeData.title
                    : "What do you want to accomplish?"
                }
                value={formData.title}
                onChange={(e) => handleChangeValue("title", e.target.value)}
                className="
                mt-1.5 h-10 w-full rounded-xl
                border border-white/10 bg-white/[0.035]
                px-3 text-[12px] text-white outline-none
                transition-colors duration-200
                placeholder:text-gray-600 hover:border-white/15
                focus:border-indigo-500/40 focus:bg-white/5
                focus:ring-4 focus:ring-indigo-500/[0.07]
                sm:mt-2 sm:h-11 sm:px-3.5
                light:border-black/10 light:bg-black/2
                light:text-lightText
              "
              />
            </div>

            {/* Description */}
            <div className="mt-3 sm:mt-5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="calendar-description"
                  className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-500 sm:text-[10px] sm:tracking-[0.18em]"
                >
                  Description
                </label>

                <span className="text-[9px] text-gray-600">Optional</span>
              </div>

              <textarea
                id="calendar-description"
                placeholder={activeData?.description || "Add some details..."}
                value={formData.description}
                onChange={(e) =>
                  handleChangeValue("description", e.target.value)
                }
                className="
                mt-1.5 block h-24 w-full resize-none rounded-xl
                border border-white/10 bg-white/[0.035]
                px-3 py-2 text-[12px] leading-5 text-white
                outline-none transition-colors duration-200
                placeholder:text-gray-600 hover:border-white/15
                focus:border-indigo-500/40 focus:bg-white/5
                focus:ring-4 focus:ring-indigo-500/[0.07]
                sm:mt-2 sm:h-36 sm:px-3.5 sm:py-3 sm:leading-6
                light:border-black/10 light:bg-black/2
                light:text-lightText
              "
              />
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2.5 border-t border-white/[0.07] pt-3 sm:mt-6 sm:pt-5 light:border-black/[0.07]">
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
                disabled={
                  updateLoading || createLoading || !formData.title?.trim()
                }
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
        )}
      </div>
    </Card>
  );
};

export default LeftDetails;
