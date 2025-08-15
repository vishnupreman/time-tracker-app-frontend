// Dashboard.tsx
import React, { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  useGetProjectTotalsQuery,
  useGetTaskTotalsQuery,
  useGetRecentEntriesQuery,
  useGetSummaryQuery,
  useGetWeeklyViewQuery,
} from "../features/dashboard/dashboardApi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch data using RTK Query
  const { data: projectTotals = [] } = useGetProjectTotalsQuery();
  const { data: taskTotals = [] } = useGetTaskTotalsQuery({ projectId: selectedProject });
  const { data: recentEntries = [] } = useGetRecentEntriesQuery({
    projectId: selectedProject,
    date: selectedDate,
    limit: 10,
  });
  const { data: summary } = useGetSummaryQuery();
  const { data: weeklyView = [] } = useGetWeeklyViewQuery();

  // Prepare weekly chart data
  const chartData = useMemo(() => {
    // Initialize array for 7 days (Sun=0, Mon=1, ..., Sat=6)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = new Array(7).fill(0);

    weeklyView.forEach((day) => {
      const dayIndex = day._id - 1; // MongoDB $dayOfWeek: 1=Sun
      if (day.entries) {
        data[dayIndex] = day.entries.reduce((acc: number, e: any) => acc + e.duration, 0);
      }
    });

    return {
      labels: days,
      datasets: [
        {
          label: "Hours Worked",
          data,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
        },
      ],
    };
  }, [weeklyView]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="border rounded p-2"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">All Projects</option>
            {projectTotals.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.projectName}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="border rounded p-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white rounded p-4 shadow">
          <h2 className="text-lg">Today's Total</h2>
          <p className="text-2xl font-bold">{summary?.today || 0}h</p>
        </div>
        <div className="bg-green-500 text-white rounded p-4 shadow">
          <h2 className="text-lg">This Week Total</h2>
          <p className="text-2xl font-bold">{summary?.week || 0}h</p>
        </div>
        <div className="bg-purple-500 text-white rounded p-4 shadow">
          <h2 className="text-lg">Tasks Completed</h2>
          <p className="text-2xl font-bold">
            {taskTotals.filter((t) => t.status === "done").length || 0}
          </p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Totals */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Project Totals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {projectTotals.map((p) => (
              <div key={p.projectId} className="border rounded p-2">
                <h3 className="font-medium">{p.projectName}</h3>
                <p>{p.totalDuration} hours</p>
              </div>
            ))}
          </div>
        </div>

        {/* Task Totals */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Task Totals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {taskTotals.map((t) => (
              <div key={t.taskId} className="border rounded p-2">
                <h3 className="font-medium">{t.taskName}</h3>
                <p>{t.totalDuration} hours</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Entries */}
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Recent Entries</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2">Project</th>
                <th className="py-2 px-2">Task</th>
                <th className="py-2 px-2">Duration</th>
                <th className="py-2 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry) => (
                <tr key={entry._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{entry.projectId.name}</td>
                  <td className="py-2 px-2">{entry.taskId.name}</td>
                  <td className="py-2 px-2">{entry.duration}h</td>
                  <td className="py-2 px-2">
                    {new Date(entry.startTime).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentEntries.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-2">
                    No entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Weekly View Chart */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Weekly View</h2>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
