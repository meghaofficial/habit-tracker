import { motion } from "framer-motion";
import { useState, type Dispatch, type SetStateAction } from "react";
import { axiosPrivate } from "../../../../api/axios";
import { formatTimestamp, notify } from "../../../../helper";
import { statusColors, type CalandarDataI } from "../../../../types";
import CircleLoader from "../../../loaders/CircleLoader";
import { MdDelete, MdEdit, MdKeyboardArrowLeft } from "react-icons/md";
import type { RootState } from "../../../../redux/store/store";
import { useSelector } from "react-redux";

type DetailsProps = {
  activeData: CalandarDataI;
  setActiveData: Dispatch<SetStateAction<CalandarDataI>>;
  setDataList: Dispatch<SetStateAction<CalandarDataI[]>>;
  setToggleUpdate: Dispatch<SetStateAction<boolean>>;
};

const Details = ({
  activeData,
  setActiveData,
  setDataList,
  setToggleUpdate,
}: DetailsProps) => {
  const theme = useSelector((state: RootState) => state.theme).theme;
  const [deleteLoading, setDeleteLoading] = useState(false);

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
          status: "",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="border-b border-white/10 light:border-black/10 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-linear-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/20">
            Note
          </span>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center rounded-xl p-2 text-red-400 hover:text-red-300 transition-all hover:scale-105 active:scale-95 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10"
              onClick={handleDelete}
              disabled={deleteLoading}
              title="Delete Task"
            >
              {deleteLoading ? <CircleLoader /> : <MdDelete />}
            </button>
            <button
              className="flex items-center gap-2 rounded-xl p-2 transition-all hover:scale-105 active:scale-105 bg-white/5 hover:bg-white/10 border border-white/10"
              onClick={() => setToggleUpdate(true)}
            >
              <MdEdit />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-2xl font-bold mt-2 bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
            {activeData.title}
          </h2>
          {activeData.status !== "default" && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg"
              style={{
                background:
                  theme === "dark"
                    ? statusColors[activeData.status]?.dbg
                    : statusColors[activeData.status]?.bg,
                border: `1px solid ${theme === "dark" ? statusColors[activeData.status]?.ddot : statusColors[activeData.status]?.dot}40`,
              }}
            >
              <div
                className="h-2 w-2 rounded-full shadow-sm animate-pulse"
                style={{
                  background:
                    theme === "dark"
                      ? statusColors[activeData.status]?.ddot
                      : statusColors[activeData.status]?.dot,
                }}
              />
              <span
                className="text-[11px] font-bold tracking-wide capitalize"
                style={{
                  color:
                    theme === "dark"
                      ? statusColors[activeData.status]?.ddot
                      : statusColors[activeData.status]?.dot,
                }}
              >
                {activeData.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-6 py-6 grow">
        <div className="group bg-white/2 rounded-2xl p-4 border border-white/5 transition-all hover:bg-white/4">
          <p className="text-[11px] opacity-50 uppercase tracking-wider font-semibold mb-3 group-hover:opacity-80 transition-opacity">
            What happened?
          </p>
          <p className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap font-medium">
            {activeData.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/10 text-[11px] font-medium text-gray-400">
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          Last Updated
        </span>
        <span className="bg-white/5 px-2.5 py-1 rounded-md">
          {activeData?.updatedAt &&
            formatTimestamp(activeData?.updatedAt?.toString())}
        </span>
      </div>
    </motion.div>
  );
};

export default Details;
