'use client'

import { useState } from "react";
import CreateTask from "../components/CreateTask";

type ColumnsType = {
  todo: string[];
  inProgress: string[];
  done: string[];
};

const initialColumns: ColumnsType = {
  todo: ["Task 1", "Task 2"],
  inProgress: ["Task 3"],
  done: ["Task 4"]
};

export default function Page() {
  const [columns, setColumns] = useState<ColumnsType>(initialColumns);
  const [isAddClicked, setIsAddClicked] = useState(false);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    task: string,
    sourceColumn: keyof ColumnsType
  ) => {
    e.dataTransfer.setData("task", task);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetColumn: keyof ColumnsType
  ) => {
    const task = e.dataTransfer.getData("task");
    const sourceColumn = e.dataTransfer.getData("sourceColumn") as keyof ColumnsType;

    if (sourceColumn !== targetColumn) {
      setColumns((prev) => {
        const newColumns: ColumnsType = { ...prev };
        newColumns[sourceColumn] = newColumns[sourceColumn].filter(t => t !== task);
        newColumns[targetColumn] = [...newColumns[targetColumn], task];
        return newColumns;
      });
    }
  };

  const handleCreateTask = (task: string) => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      todo: [...prevColumns.todo, task], 
    }));
  };

  const handleDeleteTask = (column: keyof ColumnsType, task: string) => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      [column]: prevColumns[column].filter((t) => t !== task), 
    }));
  };

  return (
  <div className="flex flex-col w-screen p-4">
    <div className="flex w-full  justify-center">
      <button 
        className="btn w-full sm:w-auto mb-4 rounded-box bg-blue-500 text-white" 
        onClick={() => setIsAddClicked(true)}
      >
        + Add item
      </button>
    </div>

    {isAddClicked && <CreateTask onClose={() => setIsAddClicked(false)} onCreateTask={handleCreateTask} />}

    <div className="flex flex-wrap justify-center gap-4 h-190">
      {Object.keys(columns).map((column) => (
        <div
          key={column}
          className="card bg-base-300 rounded-box flex flex-col p-4 w-full sm:w-1/2 md:w-1/4 lg:w-1/4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, column as keyof ColumnsType)}
        >
          <h2 className="text-white text-lg font-bold">
            {column.replace(/([A-Z])/g, " $1").trim()}
          </h2>
          {columns[column as keyof ColumnsType].map((task) => (
            <div
              key={task}
              className="flex justify-between items-center p-4 bg-gray-700 rounded-lg cursor-pointer text-white mt-2 shadow-md hover:bg-gray-600 transition-colors duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, task, column as keyof ColumnsType)}
            >
              <span className="font-medium">{task}</span>
              <button 
                className="ml-2 flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full hover:bg-red-500 transition-colors duration-200"
                onClick={() => handleDeleteTask(column as keyof ColumnsType, task)}
                aria-label="Delete task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

}
