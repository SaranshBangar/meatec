"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate, Link } from "react-router-dom"
import { format } from "date-fns"
import { ArrowLeft, Trash2 } from "lucide-react"
import type { RootState } from "../store"
import { fetchTaskById, deleteTask, clearCurrentTask } from "../store/slices/tasksSlice"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import TaskForm from "../components/tasks/task-form"

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentTask, loading } = useSelector((state: RootState) => state.tasks)

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(Number.parseInt(id)) as any)
    }

    return () => {
      dispatch(clearCurrentTask())
    }
  }, [dispatch, id])

  const handleDelete = async () => {
    if (id) {
      await dispatch(deleteTask(Number.parseInt(id)) as any)
      navigate("/tasks")
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

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!currentTask) {
    return (
      <div className="flex h-60 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">Task not found</h3>
        <p className="text-sm text-muted-foreground">
          The task you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button variant="outline" size="sm" asChild className="mt-2">
          <Link to="/tasks">Back to Tasks</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/tasks">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Task</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
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
            </CardHeader>
            <CardContent>
              <TaskForm taskId={currentTask.id} initialData={currentTask} onSuccess={() => navigate("/tasks")} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="mt-1">{getStatusBadge(currentTask.status)}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p className="mt-1 text-sm">{format(new Date(currentTask.created_at), "PPP")}</p>
              </div>
              {currentTask.updated_at && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p className="mt-1 text-sm">{format(new Date(currentTask.updated_at), "PPP")}</p>
                </div>
              )}
              {currentTask.due_date && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                  <p className="mt-1 text-sm">{format(new Date(currentTask.due_date), "PPP")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
