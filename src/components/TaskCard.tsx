import { useState } from "react";
import { Calendar, Clock, Flag, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const getStatusConfig = (status: TaskStatus) => {
  switch (status) {
    case "todo":
      return { label: "To Do", className: "status-todo" };
    case "in-progress":
      return { label: "In Progress", className: "status-in-progress" };
    case "completed":
      return { label: "Completed", className: "status-completed" };
  }
};

const getPriorityConfig = (priority: TaskPriority) => {
  switch (priority) {
    case "low":
      return { label: "Low", className: "status-todo", icon: Flag };
    case "medium":
      return { label: "Medium", className: "status-in-progress", icon: Flag };
    case "high":
      return { label: "High", className: "status-high-priority", icon: Flag };
  }
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  
  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const PriorityIcon = priorityConfig.icon;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === "completed" && task.status !== "completed") {
      setIsCompleting(true);
      setTimeout(() => {
        onStatusChange(task.id, newStatus);
        setIsCompleting(false);
      }, 300);
    } else {
      onStatusChange(task.id, newStatus);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div 
      className={cn(
        "task-card animate-fade-in-up group",
        task.status === "completed" && "opacity-75",
        isCompleting && "animate-scale-in"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("status-badge", statusConfig.className)}>
            {statusConfig.label}
          </span>
          {task.priority !== "low" && (
            <span className={cn("status-badge", priorityConfig.className)}>
              <PriorityIcon className="h-3 w-3 mr-1" />
              {priorityConfig.label}
            </span>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <h3 className={cn(
        "font-semibold text-lg mb-2 transition-all",
        task.status === "completed" && "line-through text-muted-foreground"
      )}>
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-1">
          {task.status !== "completed" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => handleStatusChange("completed")}
            >
              <Check className="h-3 w-3 mr-1" />
              Complete
            </Button>
          )}
          {task.status === "completed" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => handleStatusChange("todo")}
            >
              Reopen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}