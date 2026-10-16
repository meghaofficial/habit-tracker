import { useState } from "react";
import { ArrowLeft, GitBranch, Plus, Sparkles } from "lucide-react";

type RoadmapPageProps = {
  onBack: () => void;
  onSave: (title: string) => void;
};

export default function RoadmapPage({ onBack, onSave }: RoadmapPageProps) {
  const [title, setTitle] = useState("");

  return (
    <div className="min-h-screen rounded-2xl border border-white/10 bg-black/20 px-4 py-7 text-white sm:px-8">
      <main className="mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to roadmaps
        </button>

        <div className="mt-9">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <GitBranch size={23} />
          </div>

          <h1 className="text-2xl font-semibold">Create a roadmap</h1>

          <p className="mt-2 text-sm text-gray-400">
            Give your goal a name. We'll build the roadmap editor next.
          </p>
        </div>

        <div className="mt-7 rounded-2xl border border-white/10 bg-[#131313] p-5 sm:p-6">
          <label
            htmlFor="roadmap-title"
            className="text-sm font-medium text-gray-200"
          >
            Roadmap title
          </label>

          <input
            id="roadmap-title"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && title.trim()) {
                onSave(title.trim());
              }
            }}
            placeholder="e.g. Become a Full-Stack Developer"
            className="mt-3 w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:border-emerald-500/50"
          />

          <div className="mt-5 rounded-xl border border-dashed border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Sparkles size={19} className="text-emerald-400" />
              <div>
                <p className="text-sm font-medium">Your roadmap starts here</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Stages, nested roadmaps, sequential tasks, and progress
                  tracking will be configured in the next step.
                </p>
              </div>
            </div>
          </div>

          <button
            disabled={!title.trim()}
            onClick={() => onSave(title.trim())}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={17} />
            Create roadmap
          </button>
        </div>
      </main>
    </div>
  );
}
