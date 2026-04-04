import React, { useState } from "react";

const Demo: React.FC = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: "Workout", days: Array(7).fill(false) },
    { id: 2, name: "Read", days: Array(7).fill(false) },
    { id: 3, name: "Meditate", days: Array(7).fill(false) },
  ]);

  const toggleDay = (habitId: number, dayIndex: number) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const updatedDays = [...habit.days];
          updatedDays[dayIndex] = !updatedDays[dayIndex];
          return { ...habit, days: updatedDays };
        }
        return habit;
      })
    );
  };

  const calculateProgress = (days: boolean[]) => {
    const done = days.filter(Boolean).length;
    return Math.round((done / days.length) * 100);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Habit Tracker Demo</h1>

      <div style={styles.table}>
        {/* Header */}
        <div style={styles.rowHeader}>
          <div style={styles.habitCol}>Habit</div>
          {weekDays.map((d) => (
            <div key={d} style={styles.dayCol}>{d}</div>
          ))}
          <div style={styles.progressCol}>Progress</div>
        </div>

        {/* Rows */}
        {habits.map((habit) => (
          <div key={habit.id} style={styles.row}>
            <div style={styles.habitCol}>{habit.name}</div>

            {habit.days.map((done, i) => (
              <div
                key={i}
                style={{
                  ...styles.cell,
                  background: done ? "#22c55e" : "#1e293b",
                }}
                onClick={() => toggleDay(habit.id, i)}
              />
            ))}

            <div style={styles.progressCol}>
              {calculateProgress(habit.days)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
    padding: "40px",
    fontFamily: "Poppins, sans-serif",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "30px",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  rowHeader: {
    display: "grid",
    gridTemplateColumns: "150px repeat(7, 50px) 100px",
    fontWeight: "bold",
    color: "#94a3b8",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "150px repeat(7, 50px) 100px",
    alignItems: "center",
  },
  habitCol: {
    padding: "10px",
  },
  dayCol: {
    textAlign: "center",
  },
  progressCol: {
    textAlign: "center",
  },
  cell: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Demo;