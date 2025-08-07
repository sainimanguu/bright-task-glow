import { useState } from "react";
import { CheckSquare, Filter, SortAsc } from "lucide-react";
import { TaskCard, Task, TaskStatus, TaskPriority } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { TaskStats } from "@/components/TaskStats";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for demonstration
const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Design new user interface",
    description: "Create wireframes and mockups for the dashboard redesign project",
    status: "in-progress",
    priority: "high",
    createdAt: new Date("2024-01-15"),
    dueDate: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "Implement authentication system",
    description: "Set up JWT-based auth with proper security measures",
    status: "todo",
    priority: "high",
    createdAt: new Date("2024-01-14"),
    dueDate: new Date("2024-01-18"),
  },
  {
    id: "3",
    title: "Write unit tests",
    description: "Add comprehensive test coverage for the user management module",
    status: "completed",
    priority: "medium",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "4",
    title: "Update documentation",
    description: "Refresh API docs and add new endpoint examples",
    status: "todo",
    priority: "low",
    createdAt: new Date("2024-01-12"),
  },
];

type FilterType = "all" | TaskStatus;
type SortType = "created" | "priority" | "status";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("created");

  const handleAddTask = (newTaskData: {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: Date;
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...newTaskData,
      status: "todo",
      createdAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "created":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "status":
        const statusOrder = { "todo": 1, "in-progress": 2, "completed": 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white">
            <CheckSquare className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Task Manager
            </h1>
            <p className="text-muted-foreground text-lg">
              Organize and track your tasks efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <TaskStats tasks={tasks} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value: SortType) => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AddTaskDialog onAddTask={handleAddTask} />
      </div>

      {/* Task Grid */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="task-card max-w-md mx-auto p-8">
            <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === "all" 
                ? "Get started by creating your first task!" 
                : `No tasks with status "${filter}"`
              }
            </p>
            {filter === "all" && <AddTaskDialog onAddTask={handleAddTask} />}
            {filter !== "all" && (
              <Button 
                variant="outline" 
                onClick={() => setFilter("all")}
              >
                Show All Tasks
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.map((task, index) => (
            <div 
              key={task.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TaskCard
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}