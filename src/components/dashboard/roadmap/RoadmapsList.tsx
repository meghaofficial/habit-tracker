import { useState } from "react";
import { Plus, GitBranch, ChevronRight } from "lucide-react";
import RoadmapPage from "./RoadmapPage";
import Card from "../../shared/Card";
import SectionIcon from "../../shared/SectionIcon";
import { GiBullseye } from "react-icons/gi";
import { CustomButtonForm } from "../../shared/CutomButton";
import CircleLoader from "../../loaders/CircleLoader";

type Roadmap = {
  id: string;
  title: string;
  icon: string;
  completed: number;
  total: number;
  color: string;
};

const initialRoadmaps: Roadmap[] = [
  {
    id: "1",
    title: "System Design",
    icon: "🏗️",
    completed: 8,
    total: 20,
    color: "#8b5cf6",
  },
  {
    id: "2",
    title: "AI Engineer",
    icon: "🤖",
    completed: 4,
    total: 16,
    color: "#10b981",
  },
  {
    id: "3",
    title: "Full-Stack Development",
    icon: "💻",
    completed: 6,
    total: 18,
    color: "#38bdf8",
  },
  {
    id: "4",
    title: "Google L3 Preparation",
    icon: "🎯",
    completed: 12,
    total: 30,
    color: "#f59e0b",
  },
];

export default function RoadmapsList() {
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);
  const [showRoadmapPage, setShowRoadmapPage] = useState(false);

  if (showRoadmapPage) {
    return (
      <RoadmapPage
        onBack={() => setShowRoadmapPage(false)}
        onSave={(title) => {
          setRoadmaps((previous) => [
            ...previous,
            {
              id: crypto.randomUUID(),
              title,
              icon: "🗺️",
              completed: 0,
              total: 0,
              color: "#a78bfa",
            },
          ]);

          setShowRoadmapPage(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="mt-4">
        <Card heading="" cardWidth="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SectionIcon h="40px" w="40px" size={18} Icon={GiBullseye} />
              <div>
                <h1 className="text-lg font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Roadmap
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  The Ultimate Roadmap to Daily Consistency.
                </p>
              </div>
            </div>
            <div className="w-auto">
              <CustomButtonForm
                styling="h-10 px-5 cursor-pointer"
                // onClick={activeData?.id ? handleUpdate : handleCreate}
                // disabled={
                //   updateLoading || createLoading || !formData.title?.trim()
                // }
                type="success"
              >
                {false ? (
                  <CircleLoader />
                ) : (
                  <span className="text-[11px] font-semibold flex items-center gap-2">
                    Create New Roadmap <Plus size={15} />
                  </span>
                )}
              </CustomButtonForm>
            </div>
          </div>
        </Card>
      </div>

      <div className="min-h-screen rounded-2xl border border-white/10 bg-black/20 my-4 px-4 py-6 text-white sm:px-6">
        <main className="mx-auto max-w-6xl">
          {/* Compact roadmap cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((roadmap) => {
              const progress =
                roadmap.total > 0
                  ? Math.round((roadmap.completed / roadmap.total) * 100)
                  : 0;

              return (
                <button
                  key={roadmap.id}
                  type="button"
                  className="group flex h-[76px] items-center gap-3 rounded-xl border border-white/[0.12] bg-[#191919] px-3 text-left transition hover:border-white/25 hover:bg-[#1e1e1e]"
                  style={{
                    borderLeftWidth: "2px",
                    borderLeftColor: roadmap.color,
                  }}
                >
                  {/* Roadmap icon */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-base"
                    style={{
                      color: roadmap.color,
                      borderColor: `${roadmap.color}40`,
                      backgroundColor: `${roadmap.color}12`,
                    }}
                  >
                    <GitBranch size={18} />
                  </div>

                  {/* Title and progress */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold text-gray-100">
                        {roadmap.title}
                      </span>

                      <span
                        className="shrink-0 text-[10px] font-medium tabular-nums"
                        style={{ color: roadmap.color }}
                      >
                        {progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: roadmap.color,
                        }}
                      />
                    </div>
                  </div>

                  <ChevronRight
                    size={14}
                    className="shrink-0 text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-gray-300"
                  />
                </button>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
