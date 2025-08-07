import { CheckCircle, Clock, AlertCircle, ListTodo } from "lucide-react";
import { Task } from "./TaskCard";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const inProgressTasks = tasks.filter(task => task.status === "in-progress").length;
  const todoTasks = tasks.filter(task => task.status === "todo").length;
  const highPriorityTasks = tasks.filter(task => task.priority === "high" && task.status !== "completed").length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-completed",
      bgColor: "bg-completed/10",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      color: "text-in-progress",
      bgColor: "bg-in-progress/10",
    },
    {
      label: "High Priority",
      value: highPriorityTasks,
      icon: AlertCircle,
      color: "text-high-priority",
      bgColor: "bg-high-priority/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="task-card p-4 text-center"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-3`}>
              <Icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        );
      })}
      
      {totalTasks > 0 && (
        <div className="col-span-2 lg:col-span-4">
          <div className="task-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Completion Rate</span>
              <span className="text-sm font-bold text-primary">{completionRate}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}