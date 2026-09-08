import { useState } from "react";
import {AnimatePresence, motion} from "framer-motion";
import {
  FiBookOpen,
  FiX,
  FiPlus,
  FiArrowDown,
  FiArrowRight,
  FiCheck,
  FiTarget,
  FiGitBranch,
} from "react-icons/fi";

const RoadmapGuide = () => {
  const [showRoadmapGuide, setShowRoadmapGuide] = useState(false);
  return (
    <div>
      <motion.button
  whileHover={{ y: -1 }}
  whileTap={{ scale: 0.97 }}
  onClick={() => setShowRoadmapGuide(true)}
  className="flex h-9 items-center gap-2 rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 text-xs font-medium text-indigo-400 transition hover:bg-indigo-500/15"
>
  <FiBookOpen className="h-3.5 w-3.5" />
  Roadmap Guide
</motion.button>

<AnimatePresence>
  {showRoadmapGuide && (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowRoadmapGuide(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          flex
          max-h-[88vh]
          w-full
          max-w-4xl
          overflow-hidden
          rounded-2xl
          border
          border-neutral-800
          bg-neutral-950
          shadow-2xl
        "
      >
        {/* ============================================= */}
        {/* LEFT SIDE                                     */}
        {/* ============================================= */}

        <div
          className="
            hidden
            w-64
            shrink-0
            flex-col
            border-r
            border-neutral-800
            bg-neutral-900/40
            p-6
            md:flex
          "
        >
          {/* Icon */}

          <div
            className="
              mb-6
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-indigo-400/20
              bg-indigo-500/10
              text-indigo-400
            "
          >
            <FiBookOpen size={20} />
          </div>

          <h2 className="text-lg font-semibold text-white">
            Roadmap Guide
          </h2>

          <p className="mt-2 text-xs leading-5 text-neutral-500">
            Learn how to build a structured roadmap and
            turn your goals into achievable milestones.
          </p>

          {/* Navigation */}

          <div className="mt-8 space-y-2">
            {[
              {
                icon: FiPlus,
                label: "Getting Started",
              },
              {
                icon: FiGitBranch,
                label: "Understanding Nodes",
              },
              {
                icon: FiCheck,
                label: "Completion",
              },
              {
                icon: FiTarget,
                label: "Example",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-neutral-500"
                >
                  <div
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-md
                      bg-neutral-800
                      text-neutral-400
                    "
                  >
                    <Icon size={13} />
                  </div>

                  <span>
                    <span className="mr-1.5 text-neutral-700">
                      0{index + 1}
                    </span>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom concept */}

          <div className="mt-auto border-t border-neutral-800 pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
              Remember
            </p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <FiArrowDown className="text-indigo-400" />
                Vertical = Sequence
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <FiArrowRight className="text-indigo-400" />
                Horizontal = Breakdown
              </div>
            </div>
          </div>
        </div>

        {/* ============================================= */}
        {/* RIGHT CONTENT                                  */}
        {/* ============================================= */}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}

          <div
            className="
              flex
              shrink-0
              items-start
              justify-between
              border-b
              border-neutral-800
              px-6
              py-5
            "
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400">
                How it works
              </p>

              <h3 className="mt-1 text-xl font-semibold text-white">
                Build your roadmap
              </h3>

              <p className="mt-1 text-xs text-neutral-500">
                Turn your big goal into a clear path of milestones.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowRoadmapGuide(false)}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-neutral-500
                transition
                hover:bg-neutral-800
                hover:text-white
              "
              aria-label="Close roadmap guide"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Scrollable Content */}

          <div className="overflow-y-auto px-6 py-6">
            {/* INTRO */}

            <div
              className="
                mb-6
                rounded-xl
                border
                border-indigo-400/10
                bg-indigo-500/[0.06]
                p-5
              "
            >
              <div className="flex gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-indigo-500/10
                    text-indigo-400
                  "
                >
                  <FiBookOpen size={15} />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white">
                    What is a Roadmap?
                  </h4>

                  <p className="mt-1.5 text-xs leading-5 text-neutral-400">
                    A roadmap helps you break a large goal into
                    smaller milestones and define the order in
                    which you want to accomplish them.
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 01 */}

            <GuideStep
              number="01"
              title="Start with your first node"
            >
              <p>
                Click the{" "}
                <span className="font-medium text-indigo-400">
                  Add Node
                </span>{" "}
                button in the top-left corner of the canvas.
              </p>

              <p className="mt-2">
                The node you create becomes the starting point
                of your roadmap.
              </p>
            </GuideStep>

            {/* STEP 02 */}

            <GuideStep
              number="02"
              title="Build your sequence"
            >
              <p>
                Your roadmap follows a sequence from top to
                bottom.
              </p>

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-neutral-800
                  bg-neutral-900/60
                  p-5
                "
              >
                {["First", "Second", "Third"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="
                          rounded-lg
                          border
                          border-neutral-700
                          bg-neutral-800
                          px-3
                          py-2
                          text-[11px]
                          text-neutral-300
                        "
                      >
                        {item} Node
                      </div>

                      {index < 2 && (
                        <FiArrowDown className="text-indigo-400" />
                      )}
                    </div>
                  )
                )}
              </div>

              <p className="mt-3">
                Complete the first step, then move to the next,
                and continue until you reach your final goal.
              </p>
            </GuideStep>

            {/* STEP 03 */}

            <GuideStep
              number="03"
              title="Break a milestone into smaller steps"
            >
              <p>
                A node can either be completed directly or
                divided into smaller child nodes.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-white">
                    <FiCheck className="text-indigo-400" />
                    No children
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-neutral-500">
                    The node can be marked as Done directly.
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-white">
                    <FiGitBranch className="text-indigo-400" />
                    Has children
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-neutral-500">
                    Complete its child nodes instead. The
                    parent will be completed automatically.
                  </p>
                </div>
              </div>
            </GuideStep>

            {/* STEP 04 */}

            <GuideStep
              number="04"
              title="Completion flows upward"
            >
              <p>
                When a node has children, the parent is
                automatically marked as Done once all of its
                children are completed.
              </p>

              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-neutral-800
                  bg-neutral-900/60
                  p-5
                "
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-lg border border-neutral-700 bg-neutral-800 px-5 py-2 text-xs text-neutral-300">
                    Parent Milestone
                  </div>

                  <FiArrowDown className="text-indigo-400" />

                  <div className="flex gap-2">
                    <div className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-[10px] text-neutral-400">
                      Child 1 ✓
                    </div>

                    <div className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-[10px] text-neutral-400">
                      Child 2 ✓
                    </div>

                    <div className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-[10px] text-neutral-400">
                      Child 3 ✓
                    </div>
                  </div>

                  <p className="mt-2 text-[10px] text-indigo-400">
                    All children completed → Parent completed
                  </p>
                </div>
              </div>
            </GuideStep>

            {/* STEP 05 */}

            <GuideStep
              number="05"
              title="Reach your milestones"
            >
              <p>
                When a parent node is marked as Done, you have
                reached the milestone represented by that node.
              </p>

              <p className="mt-2">
                This lets you track progress at both the small
                task level and the larger goal level.
              </p>
            </GuideStep>

            {/* STEP 06 - EXAMPLE */}

            <GuideStep
              number="06"
              title="Example: 80% in your 12th Board Exams"
              last
            >
              <p>
                Suppose your goal is to achieve a minimum of{" "}
                <span className="font-medium text-indigo-400">
                  80%
                </span>{" "}
                in your final 12th Board Exams.
              </p>

              <p className="mt-2">
                You have Physics, Chemistry, Mathematics,
                English and Physical Education.
              </p>

              {/* Main sequence */}

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
                  Main sequence
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {[
                    "Finish NCERT",
                    "Reference Books",
                    "Practice Papers",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="
                          rounded-lg
                          border
                          border-indigo-400/15
                          bg-indigo-500/[0.07]
                          px-3
                          py-2
                          text-[11px]
                          text-neutral-300
                        "
                      >
                        {item}
                      </div>

                      {index < 2 && (
                        <FiArrowRight className="text-neutral-700" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown */}

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
                  Break down a milestone
                </p>

                <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
                  <div className="text-xs font-medium text-white">
                    Finish NCERT
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {[
                      "Physics",
                      "Chemistry",
                      "Mathematics",
                      "English",
                      "Physical Education",
                    ].map((subject) => (
                      <div
                        key={subject}
                        className="
                          rounded-lg
                          border
                          border-neutral-800
                          bg-neutral-950
                          px-2
                          py-2.5
                          text-center
                          text-[10px]
                          text-neutral-500
                        "
                      >
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chemistry */}

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
                  Go even deeper
                </p>

                <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
                  <div className="text-xs font-medium text-white">
                    Chemistry
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {[
                      "Organic",
                      "Inorganic",
                      "Physical",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-2"
                      >
                        <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-[10px] text-neutral-500">
                          {item}
                        </div>

                        {index < 2 && (
                          <FiArrowRight className="text-neutral-700" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GuideStep>

            {/* FINAL REMINDER */}

            <div
              className="
                mt-2
                rounded-xl
                border
                border-neutral-800
                bg-neutral-900/40
                p-5
              "
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2">
                    <FiArrowDown className="text-indigo-400" />
                    <span className="text-xs font-semibold text-white">
                      Vertical
                    </span>
                  </div>

                  <p className="mt-1.5 text-[11px] leading-5 text-neutral-500">
                    Defines the order of your milestones.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <FiArrowRight className="text-indigo-400" />
                    <span className="text-xs font-semibold text-white">
                      Horizontal
                    </span>
                  </div>

                  <p className="mt-1.5 text-[11px] leading-5 text-neutral-500">
                    Breaks a milestone into smaller steps.
                  </p>
                </div>
              </div>
            </div>

            {/* CLOSE */}

            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setShowRoadmapGuide(false)}
                className="
                  flex
                  h-9
                  items-center
                  gap-2
                  rounded-lg
                  bg-indigo-500
                  px-4
                  text-xs
                  font-medium
                  text-white
                  shadow-lg
                  shadow-indigo-500/10
                  transition
                  hover:bg-indigo-400
                "
              >
                Got it
                <FiCheck size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  )
}

interface GuideStepProps {
  number: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}

const GuideStep = ({
  number,
  title,
  children,
  last = false,
}: GuideStepProps) => {
  return (
    <div className="flex gap-4">
      {/* Number / Timeline */}

      <div className="flex w-8 shrink-0 flex-col items-center">
        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            border
            border-indigo-400/20
            bg-indigo-500/10
            text-[10px]
            font-semibold
            text-indigo-400
          "
        >
          {number}
        </div>

        {!last && (
          <div className="mt-2 h-full min-h-8 w-px bg-neutral-800" />
        )}
      </div>

      {/* Content */}

      <div className="pb-7">
        <h4 className="text-sm font-medium text-white">
          {title}
        </h4>

        <div className="mt-2 text-xs leading-5 text-neutral-500">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RoadmapGuide
