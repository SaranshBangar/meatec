import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.VITE_API_URL;

// Types
export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskFilters {
  status?: "pending" | "in_progress" | "completed";
  searchTerm?: string;
  sortBy?: "created_at" | "updated_at" | "due_date" | "title" | "status";
  sortOrder?: "asc" | "desc" | "ASC" | "DESC";
  limit?: number;
  offset?: number;
}

export interface TaskCreateData {
  title: string;
  description?: string;
  dueDate?: string;
  status?: "pending" | "in_progress" | "completed";
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed";
  dueDate?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}

// Helper to set auth token in headers
const setAuthHeader = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Task API functions
export const taskApi = {
  // Create a new task
  createTask: async (token: string, taskData: TaskCreateData): Promise<{ message: string; task: Task }> => {
    const response = await axios.post(`${API_URL}/tasks`, taskData, setAuthHeader(token));
    return response.data;
  },

  // Get all tasks with optional filtering and pagination
  getAllTasks: async (token: string, filters: TaskFilters = {}): Promise<Task[]> => {
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters.limit !== undefined) params.append("limit", filters.limit.toString());
    if (filters.offset !== undefined) params.append("offset", filters.offset.toString());

    const url = `${API_URL}/tasks${params.toString() ? "?" + params.toString() : ""}`;

    const response = await axios.get(url, setAuthHeader(token));
    return response.data;
  },

  // Get task statistics
  getTaskStats: async (token: string): Promise<TaskStats> => {
    const response = await axios.get(`${API_URL}/tasks/stats`, setAuthHeader(token));
    return response.data;
  },

  // Get a specific task by ID
  getTaskById: async (token: string, taskId: number): Promise<Task> => {
    const response = await axios.get(`${API_URL}/tasks/${taskId}`, setAuthHeader(token));
    return response.data;
  },

  // Update a task
  updateTask: async (token: string, taskId: number, updateData: TaskUpdateData): Promise<{ message: string; task: Task }> => {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, updateData, setAuthHeader(token));
    return response.data;
  },

  // Delete a task
  deleteTask: async (token: string, taskId: number): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`, setAuthHeader(token));
    return response.data;
  },
};
