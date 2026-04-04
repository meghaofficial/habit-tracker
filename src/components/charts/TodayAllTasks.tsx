import React, { useState } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const TodayAllTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Drink 2L water", completed: false },
    { id: 2, text: "Workout for 30 mins", completed: true },
    { id: 3, text: "Read 10 pages", completed: false },
    { id: 1, text: "Drink 2L water", completed: false },
    { id: 2, text: "Workout for 30 mins", completed: true },
    { id: 3, text: "Read 10 pages", completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <>

      {/* Task List */}
      <div className="space-y-1 w-full px-4 max-h-70 overflow-y-auto hide-scrollbar">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="bg-slate-800 px-4 py-3 rounded-lg transition flex items-center w-full gap-2"
          >
            <span>{index + 1}.</span>
            <div className="flex items-center justify-between w-full">
              {/* Task Text */}
              <span
                className={`text-sm transition ${task.completed
                    ? "line-through text-slate-400"
                    : "text-white"
                  }`}
              >
                {task.text}
              </span>

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 accent-darkPrimary cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TodayAllTasks;