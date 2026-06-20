const indigoShades = [
  "#eef2ff", // 1 (Lightest)
  "#e0e7ff", // 2
  "#c7d2fe", // 3
  "#a5b4fc", // 4
  "#6366f1", // 5 (Base Color)
  "#4f46e5", // 6
  "#4338ca", // 7
  "#3730a3", // 8
  "#312e81", // 9
  "#1e1b4b"  // 10 (Darkest)
];
const data = [
  { date: "1-Jan-2026", count: 2 },
  { date: "2-Jan-2026", count: 1 },
  { date: "3-Jan-2026", count: 5 },
  { date: "4-Jan-2026", count: 4 },
  { date: "5-Jan-2026", count: 4 },
  { date: "6-Jan-2026", count: 3 },
  { date: "7-Jan-2026", count: 2 },
  { date: "8-Jan-2026", count: 9 },
  { date: "9-Jan-2026", count: 2 },
  { date: "10-Jan-2026", count: 10 },
  { date: "11-Jan-2026", count: 7 },
  { date: "12-Jan-2026", count: 1 },
  { date: "13-Jan-2026", count: 1 },
  { date: "14-Jan-2026", count: 2 },
  { date: "15-Jan-2026", count: 4 },
  { date: "16-Jan-2026", count: 4 },
  { date: "17-Jan-2026", count: 9 },
  { date: "18-Jan-2026", count: 10 },
  { date: "19-Jan-2026", count: 1 },
  { date: "20-Jan-2026", count: 9 },
  { date: "21-Jan-2026", count: 4 },
  { date: "22-Jan-2026", count: 9 },
  { date: "23-Jan-2026", count: 7 },
  { date: "24-Jan-2026", count: 4 },
  { date: "25-Jan-2026", count: 8 },
  { date: "26-Jan-2026", count: 10 },
  { date: "27-Jan-2026", count: 5 },
  { date: "28-Jan-2026", count: 1 },
  { date: "29-Jan-2026", count: 3 },
  { date: "30-Jan-2026", count: 7 },
  { date: "31-Jan-2026", count: 6 }
];

const HeatMap = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {data.map((d, index) => (
        <div key={index} className={`h-7 w-7 rounded-lg`} style={{ backgroundColor: indigoShades[d.count-1] }} title={d.date}></div>
      ))}
    </div>
  )
}

export default HeatMap
