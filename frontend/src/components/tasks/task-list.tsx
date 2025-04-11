"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { Task } from "../../api/tasks"
import { deleteTask } from "../../store/slices/tasksSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  const dispatch = useDispatch()
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null)

  const handleDelete = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete) as any)
      setTaskToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="task-status-pending">
            Pending
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="task-status-in_progress">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="task-status-completed">
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link to={`/tasks/${task.id}`} className="truncate text-base font-medium hover:underline">
                {task.title}
              </Link>
              {getStatusBadge(task.status)}
            </div>
            {task.description && <p className="mt-1 truncate text-sm text-muted-foreground">{task.description}</p>}
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span>Created: {format(new Date(task.created_at), "MMM d, yyyy")}</span>
              {task.due_date && <span>Due: {format(new Date(task.due_date), "MMM d, yyyy")}</span>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/tasks/${task.id}`} className="flex cursor-pointer items-center">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                onClick={() => setTaskToDelete(task.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      <AlertDialog open={taskToDelete !== null} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
