import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import type { CalandarDataI } from "../../../types";

const tagColors = [
  { name: "Red", value: "#E05555" },
  { name: "Ruby", value: "#C94F6D" },
  { name: "Purple", value: "#A477D5" },
  { name: "Lavender", value: "#B49AE3" },
  { name: "Green", value: "#5EAD78" },
  { name: "Sage", value: "#91B58B" },
  { name: "Yellow", value: "#E5C454" },
  { name: "Golden", value: "#D5AA46" },
  { name: "Blue", value: "#6495DB" },
  { name: "Sky", value: "#7DBBD5" },
  { name: "Brown", value: "#A67B5B" },
  { name: "Caramel", value: "#C39770" },
  { name: "Gray", value: "#969BA5" },
  { name: "Slate", value: "#78899E" },
  { name: "Pink", value: "#DF8FB5" },
  { name: "Rose", value: "#CF7592" },
  { name: "Onion", value: "#B77C96" },
  { name: "Deep Onion", value: "#986580" },
  { name: "Orange", value: "#E59A59" },
  { name: "Teal", value: "#59ADA5" },
];

interface TagColorPickerProps {
  tag: string;
  selectedColor: string;
  setFormData: Dispatch<SetStateAction<CalandarDataI>>;
}

const TagColorPicker = ({
  tag,
  selectedColor,
  setFormData,
}: TagColorPickerProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleChangeValue = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* SELECT BAR */}
      <div className=" flex h-11 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-3 transition-all duration-200 focus-within:border-indigo-400/30 light:border-black/10 light:bg-black/2 ">
        {/* COLOR */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className=" flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-transform hover:scale-105 "
          style={{ backgroundColor: `${selectedColor}20` }}
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: selectedColor,
              boxShadow: `0 0 10px ${selectedColor}55`,
            }}
          />
        </button>

        {/* EDITABLE TAG */}
        <input
          value={tag}
          onChange={(e) => handleChangeValue("tag", e.target.value)}
          placeholder="Tag name"
          className=" min-w-0 flex-1 bg-transparent text-[12px] font-medium text-gray-200 outline-none placeholder:text-gray-600 light:text-gray-700 "
        />

        {/* DROPDOWN ICON */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className=" flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300 "
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={14} />
          </motion.div>
        </button>
      </div>

      {/* COLOR MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 6,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -4,
              scale: 0.98,
            }}
            transition={{
              duration: 0.16,
            }}
            className=" absolute left-0 right-0 z-50 rounded-2xl border border-white/10 bg-[#111114]/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl light:border-black/10 light:bg-white/95 "
          >
            {/* HEADER */}
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                Tag Color
              </span>

              <span className="text-[10px] text-gray-600">
                {tag || "Untitled"}
              </span>
            </div>

            {/* COLORS */}
            <div className="grid grid-cols-10 gap-2">
              {tagColors.map((color) => {
                const selected = selectedColor === color.value;

                return (
                  <button
                    key={color.value}
                    type="button"
                    title={color.name}
                    onClick={() => {
                      handleChangeValue("color", color.value);
                      setOpen(false);
                    }}
                    className=" group relative flex aspect-square items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 "
                    style={{
                      backgroundColor: `${color.value}18`,
                    }}
                  >
                    <span
                      className=" flex h-4 w-4 items-center justify-center rounded-full transition-all group-hover:scale-110 "
                      style={{
                        backgroundColor: color.value,
                        boxShadow: selected
                          ? `0 0 0 3px ${color.value}25`
                          : undefined,
                      }}
                    >
                      {selected && (
                        <FiCheck
                          size={10}
                          strokeWidth={3}
                          className="text-white"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TagColorPicker;
