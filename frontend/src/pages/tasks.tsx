"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Search, Filter, X } from "lucide-react";
import type { RootState } from "../store";
import { fetchTasks, setFilters } from "../store/slices/tasksSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TaskList from "../components/tasks/task-list";
import TaskForm from "../components/tasks/task-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Tasks() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const { tasks, filters, loading } = useSelector((state: RootState) => state.tasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);

  // Check if the URL has a 'new' query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("new") === "true") {
      setShowNewTaskDialog(true);
      // Remove the query parameter
      navigate("/tasks", { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    console.log("Tasks page: Fetching tasks with filters:", filters);
    console.log("Token available:", !!token);
    // Pass the current filters to fetchTasks so it uses the filters from component state
    dispatch(fetchTasks(filters) as any);
  }, [dispatch, filters, token]);

  // Debug: Log tasks state
  useEffect(() => {
    console.log("Tasks page - current tasks:", tasks);
    console.log("Loading state:", loading);
  }, [tasks, loading]);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    dispatch(setFilters({ searchTerm }) as any);
  };

  const handleStatusChange = (value: string) => {
    console.log("Status filter changed to:", value);
    dispatch(setFilters({ status: value === "all" ? undefined : (value as any) }) as any);
  };

  const handleSortChange = (value: string) => {
    console.log("Sort changed to:", value);
    const [sortBy, sortOrder] = value.split("-");
    dispatch(setFilters({ sortBy, sortOrder }) as any);
  };

  const handleClearFilters = () => {
    console.log("Clearing all filters");
    setSearchTerm("");
    dispatch(
      setFilters({
        searchTerm: undefined,
        status: undefined,
        sortBy: "created_at",
        sortOrder: "desc",
      }) as any
    );
  };

  const closeNewTaskDialog = () => {
    setShowNewTaskDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and track your progress</p>
        </div>
        <Button onClick={() => setShowNewTaskDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue={filters.status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest</SelectItem>
              <SelectItem value="created_at-asc">Oldest</SelectItem>
              <SelectItem value="due_date-asc">Due Date</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleClearFilters}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="w-8 h-8 border-4 rounded-full animate-spin border-primary border-t-transparent"></div>
        </div>
      ) : tasks.length > 0 ? (
        <TaskList tasks={tasks} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-center border border-dashed rounded-lg h-60">
          <div className="p-3 rounded-full bg-primary/10">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No tasks found</h3>
          <p className="text-sm text-muted-foreground">
            {filters.searchTerm || filters.status
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Create your first task to get started."}
          </p>
          {(filters.searchTerm || filters.status) && (
            <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-2">
              Clear filters
            </Button>
          )}
        </div>
      )}

      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your list. Fill out the details below.</DialogDescription>
          </DialogHeader>
          <TaskForm onSuccess={closeNewTaskDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
