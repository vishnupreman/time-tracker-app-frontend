// TimerPage.tsx
import React, { useState, useEffect } from "react";
import {
  useGetProjectsQuery,
 type Project,
} from "../features/projects/projectApi";
import {
  useGetTasksQuery,
  type Task,
} from "../features/task/taskApi";
import {
  useGetEntriesQuery,
  useStartTimerMutation,
  useStopTimerMutation,
  useAddManualEntryMutation,
  useDeleteEntryMutation,
 type ITimeEntry,
} from "../features/timer/timerApi";

const TimerPage: React.FC = () => {
  // Selected project & task
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<string>("");

  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timer, setTimer] = useState(0); // seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

  // Manual entry
  const [manualStart, setManualStart] = useState("");
  const [manualEnd, setManualEnd] = useState("");

  // Fetch backend data
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: tasks = [] } = useGetTasksQuery();
  const { data: timeEntries = [], refetch } = useGetEntriesQuery({
    projectId: selectedProject || undefined,
    taskId: selectedTask || undefined,
  });

  const [startTimer] = useStartTimerMutation();
  const [stopTimer] = useStopTimerMutation();
  const [addManualEntry] = useAddManualEntryMutation();
  const [deleteEntry] = useDeleteEntryMutation();

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (intervalId) {
      clearInterval(intervalId);
    }
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleStart = async () => {
    if (!selectedProject || !selectedTask) return;
    await startTimer({ projectId: selectedProject, taskId: selectedTask });
    refetch();
    setIsTimerRunning(true);
  };

  const handleStop = async () => {
    await stopTimer();
    refetch();
    setIsTimerRunning(false);
    setTimer(0);
  };

const handleAddManualEntry = async () => {
  if (!selectedProject || !selectedTask || !manualStart || !manualEnd) {
    alert("Please select project, task and enter start & end time");
    return;
  }

  // Convert HH:MM to full Date objects for today
  const today = new Date();

  const [startHours, startMinutes] = manualStart.split(":").map(Number);
  const [endHours, endMinutes] = manualEnd.split(":").map(Number);

  const start = new Date(today);
  start.setHours(startHours, startMinutes, 0, 0);

  const end = new Date(today);
  end.setHours(endHours, endMinutes, 0, 0);

  // Validate that end is after start
  if (end <= start) {
    alert("End time must be after start time");
    return;
  }

  try {
    await addManualEntry({
      projectId: selectedProject,
      taskId: selectedTask,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });

    setManualStart("");
    setManualEnd("");
    refetch();
  } catch (error) {
    console.error("Failed to add manual entry:", error);
    alert("Failed to add manual entry. Check console for details.");
  }
};

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    refetch();
  };

  // Calculate today's total in minutes
  const todayTotal = timeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0);

  const formatMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">Timer Tracking</h1>
        <div className="flex items-center space-x-2">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Task</option>
            {tasks
              .filter((t) => !selectedProject || t.projectId._id === selectedProject)
              .map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
          </select>
          {!isTimerRunning ? (
            <button
              disabled={!selectedProject || !selectedTask}
              onClick={handleStart}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              Start Timer
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Stop Timer
            </button>
          )}
        </div>
      </div>

      {/* Active Timer */}
      {isTimerRunning && selectedProject && selectedTask && (
        <div className="bg-gray-100 p-4 rounded mb-6 flex justify-between items-center">
          <div>
            <p>
              <span className="font-semibold">Task:</span>{" "}
              {tasks.find((t) => t._id === selectedTask)?.name}
            </p>
            <p>
              <span className="font-semibold">Project:</span>{" "}
              {projects.find((p) => p._id === selectedProject)?.name}
            </p>
          </div>
          <p className="text-xl font-mono">{formatTime(timer)}</p>
        </div>
      )}

      {/* Manual Entry */}
      <div className="bg-white p-4 rounded mb-6 border border-gray-200">
        <h2 className="font-bold mb-2">Manual Time Entry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="">Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="">Task</option>
            {tasks
              .filter((t) => !selectedProject || t.projectId._id === selectedProject)
              .map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
          </select>
          <input
            type="time"
            value={manualStart}
            onChange={(e) => setManualStart(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <input
            type="time"
            value={manualEnd}
            onChange={(e) => setManualEnd(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <button
            onClick={handleAddManualEntry}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Entry
          </button>
        </div>
      </div>

      {/* Time Logs Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-200">Date</th>
              <th className="p-2 border border-gray-200">Project</th>
              <th className="p-2 border border-gray-200">Task</th>
              <th className="p-2 border border-gray-200">Start Time</th>
              <th className="p-2 border border-gray-200">End Time</th>
              <th className="p-2 border border-gray-200">Duration</th>
              <th className="p-2 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeEntries.map((entry) => (
              <tr key={entry._id} className="hover:bg-gray-50">
                <td className="p-2 border">{new Date(entry.startTime).toLocaleDateString()}</td>
                <td className="p-2 border">{projects.find(p => p._id === entry.projectId)?.name}</td>
                <td className="p-2 border">{tasks.find(t => t._id === entry.taskId)?.name}</td>
                <td className="p-2 border">{new Date(entry.startTime).toLocaleTimeString()}</td>
                <td className="p-2 border">{entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : "-"}</td>
                <td className="p-2 border">{entry.duration ? formatMinutes(entry.duration) : "-"}</td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {timeEntries.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-2">No entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-100 p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <p><span className="font-semibold">Today's Total:</span> {formatMinutes(todayTotal)}</p>
        <p><span className="font-semibold">This Week's Total:</span> 12h 20m</p>
        <div><span className="font-semibold">Weekly View:</span> Bar chart placeholder</div>
      </div>
    </div>
  );
};

export default TimerPage;
