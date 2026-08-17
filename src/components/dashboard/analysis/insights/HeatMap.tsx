import type { HeatMapI } from "../../../types";

const palette = [
  "rgba(255, 255, 255, 0.03)", // 0 completions: subtle frosted slate
  "rgba(99, 102, 241, 0.15)",   // 1 completion
  "rgba(99, 102, 241, 0.3)",    // 2 completions
  "rgba(99, 102, 241, 0.45)",   // 3 completions
  "rgba(99, 102, 241, 0.6)",    // 4 completions
  "rgba(99, 102, 241, 0.75)",   // 5 completions
  "rgba(99, 102, 241, 0.9)",    // 6 completions
  "#6366F1",                    // 7 completions
  "#818CF8",                    // 8 completions
  "#A5B4FC",                    // 9 completions
  "#E0E7FF",                    // 10+ completions
];

const HeatMap = ({ heatMapData }: { heatMapData: HeatMapI[] }) => {
  return (
    <div className="flex flex-wrap gap-2 py-1">
      {heatMapData?.map((d, index) => {
        const count = d.count || 0;
        const color = palette[Math.min(count, palette.length - 1)];
        return (
          <div
            key={index}
            className="h-7 w-7 rounded-md border border-white/5 transition-all duration-300 hover:scale-105 hover:border-indigo-500/40 hover:shadow-[0_0_8px_rgba(99,102,241,0.2)] cursor-help"
            style={{ backgroundColor: color }}
            title={`${count} tasks completed`}
          />
        );
      })}
    </div>
  );
};

export default HeatMap;
