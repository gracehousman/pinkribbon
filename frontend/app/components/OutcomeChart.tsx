import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function OutcomeChart({ data }: any) {
  const chartData = [
    { name: "Independence", value: data.independence_rate },
    { name: "Mortality", value: data.mortality_rate },
  ];

  return (
    <BarChart width={400} height={300} data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" />
    </BarChart>
  );
}
