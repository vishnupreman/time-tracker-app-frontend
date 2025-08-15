// ProjectsPage.tsx
import React, { useState } from "react";
import { useCreateProjectMutation, useDeleteProjectMutation, useGetProjectsQuery, useUpdateProjectMutation } from "../features/projects/projectApi";

interface Project {
  _id: string;
  name: string;
  description: string;
}

const ProjectsPage: React.FC = () => {
  const { data: projects, isLoading } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const openAddModal = () => {
    setCurrentProject(null);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setCurrentProject(project);
    setName(project.name);
    setDescription(project.description);
    setIsModalOpen(true);
  };

  const openDeleteModal = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteModalOpen(true);
  };

  const saveProject = async()=>{
    if(!name) return
    if(currentProject){
       await updateProject({ id: currentProject._id, body: { name, description } });
    }else{
      await createProject({name,description})
    }
    setIsModalOpen(false)
  }

  const handleDelete = async() => {
    if (currentProject) {
      await deleteProject(currentProject._id)
    }
    setIsDeleteModalOpen(false);
  };

    if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Project
        </button>
      </div>

      {/* Project List Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border border-gray-200 text-left">Name</th>
              <th className="p-3 border border-gray-200 text-left">
                Description
              </th>
              <th className="p-3 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project) => (
              <tr key={project._id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200">{project.name}</td>
                <td className="p-3 border border-gray-200">
                  {project.description}
                </td>
                <td className="p-3 border border-gray-200 space-x-2 text-center">
                  <button
                    onClick={() => openEditModal(project)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(project)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {projects?.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-3">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {currentProject ? "Edit Project" : "Add Project"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
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
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveProject}
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
            <h2 className="text-xl font-bold mb-4">Delete Project</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {currentProject?.name}
              </span>
              ?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default ProjectsPage;
