// TasksPage.tsx
import React, { useState } from "react";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../features/task/taskApi';
import { useGetProjectsQuery } from "../features/projects/projectApi";

interface Task {
  _id: string;
  name: string;
  description?: string;
  status: "pending" | "done";
  projectId: { _id: string; name: string };
}

const TasksPage: React.FC = () => {
  const { data: tasks = []} = useGetTasksQuery();
  const { data: projects = []} = useGetProjectsQuery();

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();

  const [filterProject, setFilterProject] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [status, setStatus] = useState<"pending" | "done">("pending");

  const openAddModal = () => {
    setCurrentTask(null);
    setName("");
    setDescription("");
    setProject("");
    setStatus("pending");
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setName(task.name);
    setDescription(task.description || "");
    setProject(task.projectId._id);
    setStatus(task.status);
    setIsModalOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setCurrentTask(task);
    setIsDeleteModalOpen(true);
  };

  const saveTask = async () => {
    if (!name || !project) return alert("Name and Project are required");

    const body = { name, description, status, projectId: project };

    try {
      if (currentTask?._id) {
        await updateTask({ id: currentTask._id, body }).unwrap();
      } else {
        await createTask(body).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save task");
    }
  };

  const deleteTask = async () => {
    if (!currentTask?._id) return;
    try {
      await deleteTaskMutation(currentTask._id).unwrap();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  const filteredTasks =
    filterProject === "All"
      ? tasks
      : tasks.filter((t) => t.projectId._id === filterProject);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center space-x-2">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Task List Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border border-gray-200 text-left">Name</th>
              <th className="p-3 border border-gray-200 text-left">Description</th>
              <th className="p-3 border border-gray-200 text-left">Project</th>
              <th className="p-3 border border-gray-200 text-left">Status</th>
              <th className="p-3 border border-gray-200 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200">{task.name}</td>
                <td className="p-3 border border-gray-200">{task.description}</td>
                <td className="p-3 border border-gray-200">{task.projectId.name}</td>
                <td className="p-3 border border-gray-200">{task.status}</td>
                <td className="p-3 border border-gray-200 space-x-2 text-center">
                  <button
                    onClick={() => openEditModal(task)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(task)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-3">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {currentTask ? "Edit Task" : "Add Task"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Project</label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "pending" | "done")}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveTask}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Delete Task</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{currentTask?.name}</span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={deleteTask}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
