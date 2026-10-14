"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  LockKeyhole,
  Search,
} from "lucide-react";

type Topic = {
  id: string;
  title: string;
  icon: string;
  totalProblems: number;
  completedProblems: number;
  color: string;
};

type Stage = {
  id: number;
  title: string;
  description: string;
  badge?: string;
  topics: Topic[];
};

type Props = {
  onBack?: () => void;
  onOpenTopic?: (topic: Topic, stage: Stage) => void;
};

const stages: Stage[] = [
  {
    id: 1,
    title: "Foundation",
    description:
      "Learn fundamental concepts through simple, focused problems. Master the building blocks before moving on.",
    badge: "Start here",
    topics: [
      {
        id: "system-design-basics",
        title: "System Design Basics",
        icon: "🌱",
        totalProblems: 5,
        completedProblems: 0,
        color: "#10b981",
      },
      {
        id: "state-booking",
        title: "State & Booking Systems",
        icon: "🗓️",
        totalProblems: 5,
        completedProblems: 0,
        color: "#3b82f6",
      },
    ],
  },
  {
    id: 2,
    title: "Core Components",
    description:
      "Understand the core infrastructure components that power modern distributed systems.",
    topics: [
      {
        id: "rate-limiting",
        title: "Rate Limiting & Caching",
        icon: "🛡️",
        totalProblems: 3,
        completedProblems: 0,
        color: "#f59e0b",
      },
      {
        id: "data-storage",
        title: "Data Storage & Retrieval",
        icon: "🗄️",
        totalProblems: 4,
        completedProblems: 0,
        color: "#a78bfa",
      },
      {
        id: "scheduling",
        title: "Scheduling & Notifications",
        icon: "⏰",
        totalProblems: 3,
        completedProblems: 0,
        color: "#ec4899",
      },
    ],
  },
  {
    id: 3,
    title: "Real-World Applications",
    description:
      "Apply your knowledge to design systems you use every day — social media, streaming, e-commerce.",
    topics: [
      {
        id: "social-media",
        title: "Social Media Platforms",
        icon: "📱",
        totalProblems: 4,
        completedProblems: 0,
        color: "#06b6d4",
      },
      {
        id: "messaging",
        title: "Messaging & Communication",
        icon: "💬",
        totalProblems: 3,
        completedProblems: 0,
        color: "#8b5cf6",
      },
      {
        id: "media-streaming",
        title: "Media Streaming",
        icon: "🎞️",
        totalProblems: 4,
        completedProblems: 0,
        color: "#f43f5e",
      },
      {
        id: "ecommerce",
        title: "E-commerce & Payments",
        icon: "🛒",
        totalProblems: 5,
        completedProblems: 0,
        color: "#22c55e",
      },
      {
        id: "location-delivery",
        title: "Location & Delivery",
        icon: "📍",
        totalProblems: 4,
        completedProblems: 0,
        color: "#f97316",
      },
      {
        id: "search-discovery",
        title: "Search & Discovery",
        icon: "🔎",
        totalProblems: 4,
        completedProblems: 0,
        color: "#38bdf8",
      },
    ],
  },
  {
    id: 4,
    title: "Advanced Infrastructure",
    description:
      "Master complex distributed systems and infrastructure challenges.",
    topics: [
      {
        id: "distributed-storage",
        title: "Distributed Storage",
        icon: "🗂️",
        totalProblems: 4,
        completedProblems: 0,
        color: "#a78bfa",
      },
      {
        id: "core-infrastructure",
        title: "Core Infrastructure",
        icon: "🏗️",
        totalProblems: 3,
        completedProblems: 0,
        color: "#38bdf8",
      },
      {
        id: "observability",
        title: "Observability & Monitoring",
        icon: "📊",
        totalProblems: 4,
        completedProblems: 0,
        color: "#a3e635",
      },
      {
        id: "data-processing",
        title: "Data Processing",
        icon: "⚡",
        totalProblems: 4,
        completedProblems: 0,
        color: "#fb7185",
      },
      {
        id: "realtime",
        title: "Real-time Collaboration",
        icon: "👥",
        totalProblems: 3,
        completedProblems: 0,
        color: "#d946ef",
      },
    ],
  },
];

export default function RoadmapsPage({ onBack, onOpenTopic }: Props) {
  const [roadmapStages, setRoadmapStages] = useState(stages);
  const [search, setSearch] = useState("");
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  const totals = useMemo(() => {
    let completed = 0;
    let total = 0;

    roadmapStages.forEach((stage) => {
      stage.topics.forEach((topic) => {
        completed += topic.completedProblems;
        total += topic.totalProblems;
      });
    });

    return {
      completed,
      total,
      percentage: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [roadmapStages]);

  const visibleStages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return roadmapStages
      .map((stage) => ({
        ...stage,
        topics: stage.topics.filter((topic) => {
          const matchesSearch =
            !query ||
            topic.title.toLowerCase().includes(query) ||
            stage.title.toLowerCase().includes(query);

          const matchesCompletion =
            !showCompletedOnly ||
            topic.completedProblems === topic.totalProblems;

          return matchesSearch && matchesCompletion;
        }),
      }))
      .filter((stage) => stage.topics.length > 0);
  }, [roadmapStages, search, showCompletedOnly]);

  const updateTopic = (stageId: number, topicId: string, delta: number) => {
    setRoadmapStages((previous) =>
      previous.map((stage) =>
        stage.id !== stageId
          ? stage
          : {
              ...stage,
              topics: stage.topics.map((topic) =>
                topic.id !== topicId
                  ? topic
                  : {
                      ...topic,
                      completedProblems: Math.max(
                        0,
                        Math.min(
                          topic.totalProblems,
                          topic.completedProblems + delta,
                        ),
                      ),
                    },
              ),
            },
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <main className="mx-auto min-h-screen max-w-[1100px] border-x border-white/[0.06] px-4 pb-12 pt-5 sm:px-7 sm:pt-7 lg:px-10">
        {/* Header */}
        <header className="flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="mt-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={19} strokeWidth={1.7} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                System Design Roadmap
              </h1>
            </div>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-400 sm:text-sm">
              A curated path of essential problems, organized from beginner to
              expert.
              <br className="hidden sm:block" />
              Start from Level 1 and work your way down.
            </p>
          </div>
        </header>

        {/* Overall progress */}
        <section className="mt-6 max-w-md">
          <div className="rounded-full border border-white/[0.13] bg-[#151515] px-3 py-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] text-gray-400">
                Overall Progress
              </span>
              <span className="text-[11px] font-semibold text-emerald-400">
                {totals.percentage}%
              </span>
            </div>

            <div
              className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]"
              role="progressbar"
              aria-label="Overall roadmap progress"
              aria-valuenow={totals.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${totals.percentage}%` }}
              />
            </div>
          </div>
        </section>

        {/* Search and completion filter */}
        <section className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a topic..."
              aria-label="Search roadmap topics"
              className="w-full rounded-lg border border-white/10 bg-[#111111] py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-gray-600 focus:border-white/25"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowCompletedOnly((value) => !value)}
            aria-pressed={showCompletedOnly}
            className={`inline-flex items-center justify-center gap-2 self-start rounded-lg border px-3 py-2 text-xs transition sm:self-auto ${
              showCompletedOnly
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Check size={14} />
            Completed only
          </button>
        </section>

        {/* Roadmap stages */}
        <div className="mt-7">
          {visibleStages.map((stage, index) => (
            <section key={stage.id} className="relative">
              {/* Stage heading */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
                    stage.id === 1
                      ? "bg-emerald-500"
                      : stage.id === 2
                        ? "bg-blue-500"
                        : stage.id === 3
                          ? "bg-amber-500"
                          : "bg-purple-500"
                  }`}
                >
                  {stage.id}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold leading-5">
                      {stage.title}
                    </h2>

                    {stage.badge && (
                      <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
                        {stage.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] leading-4 text-gray-500">
                    {stage.description}
                  </p>
                </div>
              </div>

              {/* Topic cards */}
              <div className="ml-0 mt-3 grid grid-cols-1 gap-2.5 sm:ml-10 sm:grid-cols-2 lg:grid-cols-4">
                {stage.topics.map((topic) => {
                  const percentage = Math.round(
                    (topic.completedProblems / topic.totalProblems) * 100,
                  );

                  const completed =
                    topic.completedProblems === topic.totalProblems;

                  return (
                    <article
                      key={topic.id}
                      className="group relative min-h-[108px] overflow-hidden rounded-xl border border-white/[0.12] bg-[#191919] transition duration-200 hover:border-white/25 hover:bg-[#1d1d1d]"
                      style={{
                        borderLeftColor: topic.color,
                        borderLeftWidth: "2px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onOpenTopic?.(topic, stage)}
                        aria-label={`Open ${topic.title}`}
                        className="flex min-h-[108px] w-full flex-col p-3 text-left"
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 text-[12px] leading-4">
                            {completed ? (
                              <Check size={13} style={{ color: topic.color }} />
                            ) : (
                              topic.icon
                            )}
                          </span>

                          <h3 className="min-w-0 flex-1 text-[11px] font-semibold leading-[1.5] text-gray-100">
                            {topic.title}
                          </h3>

                          <ChevronRight
                            size={13}
                            className="mt-0.5 shrink-0 text-gray-600 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                          />
                        </div>

                        <div className="mt-auto pt-4">
                          <div className="flex items-center justify-between gap-2 text-[9px] text-gray-500">
                            <span>
                              {topic.completedProblems}/{topic.totalProblems}{" "}
                              completed
                            </span>
                            <span style={{ color: topic.color }}>
                              {percentage}%
                            </span>
                          </div>

                          <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: topic.color,
                              }}
                            />
                          </div>
                        </div>
                      </button>

                      {/* Local demo control to test progress */}
                      <button
                        type="button"
                        title={
                          completed
                            ? "Undo last completion"
                            : "Complete one problem"
                        }
                        aria-label={
                          completed
                            ? `Undo completion for ${topic.title}`
                            : `Complete one problem for ${topic.title}`
                        }
                        onClick={() =>
                          updateTopic(stage.id, topic.id, completed ? -1 : 1)
                        }
                        className="absolute bottom-2 right-2 rounded-md p-1 text-gray-600 opacity-0 transition hover:bg-white/10 hover:text-white focus:opacity-100 group-hover:opacity-100"
                      >
                        {completed ? <Circle size={12} /> : <Check size={12} />}
                      </button>
                    </article>
                  );
                })}
              </div>

              {/* Connector to next visible stage */}
              {index < visibleStages.length - 1 && (
                <div className="flex h-12 items-center justify-center sm:ml-10">
                  <ArrowDown
                    size={17}
                    strokeWidth={1.5}
                    className="text-gray-600"
                  />
                </div>
              )}
            </section>
          ))}

          {visibleStages.length === 0 && (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 px-5 py-16 text-center">
              <Search size={24} className="text-gray-500" />
              <h3 className="mt-3 text-sm font-semibold">No matching topics</h3>
              <p className="mt-1 text-xs text-gray-500">
                Try a different search or turn off the completed filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setShowCompletedOnly(false);
                }}
                className="mt-4 text-xs text-emerald-400 hover:text-emerald-300"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-white/[0.08] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-600">
            <span>
              {totals.completed} of {totals.total} problems completed
            </span>
            <span>Keep learning, one step at a time.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
