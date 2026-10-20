import { PRESET_ICONS } from "../testData";

type IconPickerModalProps = {
  selectedIcon: string;
  onSelect: (icon: string) => void;
  onClose: () => void;
};

export default function IconPickerModal({
  selectedIcon,
  onSelect,
  onClose,
}: IconPickerModalProps) {
  const icons = PRESET_ICONS;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#191919] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-white">Choose an icon</h2>
            <p className="mt-1 text-[11px] text-gray-500">
              Select an icon for your roadmap.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close icon picker"
          >
            ✕
          </button>
        </div>

        {/* Icon grid */}
        <div className="max-h-[min(55vh,360px)] overflow-y-auto px-3 py-3">
          {icons.length > 0 ? (
            <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-8">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  title={icon}
                  onClick={() => {
                    onSelect(icon);
                    onClose();
                  }}
                  className={`flex aspect-square items-center justify-center rounded-xl border text-xl transition ${
                    selectedIcon === icon
                      ? "border-indigo-500/60 bg-indigo-500/15"
                      : "border-transparent hover:border-white/10 hover:bg-white/6"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-xs text-gray-500">
              No matching icons found.
            </p>
          )}
        </div>

        <div className="border-t border-white/8 px-4 py-3 text-[10px] text-gray-500">
          {icons.length} icons available
        </div>
      </div>
    </div>
  );
}
