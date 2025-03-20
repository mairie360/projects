'use client'

import { useState } from "react";

const CreateTask = ({ onClose, onCreateTask }: { onClose: () => void; onCreateTask: (task: string) => void }) => {
  const [taskName, setTaskName] = useState("");

  const handleCreate = () => {
    if (taskName.trim() === "") return;
    onCreateTask(taskName);
    setTaskName("");
    onClose(); 
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="card bg-base-300 rounded-box flex h-100 w-96 flex-col p-4 justify-center items-center relative">
        <button 
          className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-2"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="card-title">Create a task</h2>
        <input 
          type="text" 
          placeholder="Task name" 
          className="input input-bordered mt-2 w-full" 
          value={taskName} 
          onChange={(e) => setTaskName(e.target.value)} 
        />
        <button className="btn btn-primary mt-4 w-full" onClick={handleCreate}>
          Create task
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
