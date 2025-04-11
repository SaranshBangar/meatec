"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, ListTodo, Plus } from "lucide-react";
import type { RootState } from "../store";
import { fetchTasks, fetchTaskStats } from "../store/slices/tasksSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TaskList from "../components/tasks/task-list";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { tasks, stats, loading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    console.log("Fetching tasks with token available:", !!token);
    dispatch(fetchTasks({ limit: 5 }) as any);
    dispatch(fetchTaskStats() as any);
  }, [dispatch, token]);

  // Debug: Log tasks state
  useEffect(() => {
    console.log("Current tasks state:", tasks);
    console.log("Stats:", stats);
    console.log("Loading:", loading);
  }, [tasks, stats, loading]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's an overview of your tasks.</p>
        </div>
        <Button asChild>
          <Link to="/tasks?new=true">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.in_progress || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>Your most recently created tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 rounded-full animate-spin border-primary border-t-transparent"></div>
            </div>
          ) : tasks && tasks.length > 0 ? (
            <TaskList tasks={tasks} />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-2 p-8 text-center border border-dashed rounded-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <ListTodo className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No tasks yet</h3>
              <p className="text-sm text-muted-foreground">Create your first task to get started</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/tasks">View All Tasks</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
