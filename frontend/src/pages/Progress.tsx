import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    day: "Mon",
    score: 50,
  },
  {
    day: "Tue",
    score: 60,
  },
  {
    day: "Wed",
    score: 65,
  },
  {
    day: "Thu",
    score: 72,
  },
  {
    day: "Fri",
    score: 80,
  },
];

function Progress() {

  return (
    <div className="page-container">

      <h1>📊 My Progress</h1>

      <div className="chart-container">

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart data={data}>

            <CartesianGrid />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Progress;