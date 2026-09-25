import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import type { CalandarDataI } from "../../../../types";

const tagColors = [
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Purple", value: "#A855F7" },
  { name: "Fuchsia", value: "#D946EF" },
  { name: "Pink", value: "#EC4899" },

  { name: "Rose", value: "#F43F5E" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Yellow", value: "#EAB308" },

  { name: "Lime", value: "#84CC16" },
  { name: "Green", value: "#22C55E" },
  { name: "Emerald", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },

  { name: "Sky", value: "#0EA5E9" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Slate", value: "#64748B" },
  { name: "Stone", value: "#78716C" },
  { name: "Zinc", value: "#71717A" },
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
      <div
        className="
          flex h-11 w-full items-center gap-3
          rounded-xl border border-white/10
          bg-white/3
          px-3
          transition-all duration-200
          focus-within:border-indigo-400/30
          light:border-black/10
          light:bg-black/2
        "
      >
        {/* COLOR */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="
            flex h-6 w-6 shrink-0 items-center justify-center
            rounded-lg
            transition-transform
            hover:scale-105
          "
          style={{
            backgroundColor: `${selectedColor}20`,
          }}
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

        {/* DROPDOWN */}
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
                      // setSelectedColor(color.value);

                      // // update your form
                      // setFormData((prev) => ({
                      //   ...prev,
                      //   status: tag,
                      //   color: color.value,
                      // }));

                      setOpen(false);
                    }}
                    className="
                      group relative flex
                      aspect-square
                      items-center justify-center
                      rounded-lg
                      transition-all duration-200
                      hover:scale-110
                    "
                    style={{
                      backgroundColor: `${color.value}18`,
                    }}
                  >
                    <span
                      className="
                        flex h-4 w-4
                        items-center justify-center
                        rounded-full
                        transition-all
                        group-hover:scale-110
                      "
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
