import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { taskApi, type Task, type TaskFilters, type TaskCreateData, type TaskUpdateData, type TaskStats } from "../../api/tasks";

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  stats: TaskStats | null;
  filters: TaskFilters;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  stats: null,
  filters: {
    sortBy: "created_at",
    sortOrder: "desc",
  },
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (filters: TaskFilters = {}, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as any;
    if (!auth.token) {
      console.error("No auth token found when fetching tasks");
      return rejectWithValue("Not authenticated");
    }

    console.log("Fetching tasks with token:", auth.token.substring(0, 10) + "...");
    const mergedFilters = { ...initialState.filters, ...filters };
    console.log("Using filters:", mergedFilters);

    const tasks = await taskApi.getAllTasks(auth.token, mergedFilters);
    console.log(`Successfully fetched ${tasks.length} tasks`);
    return tasks;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch tasks";
    console.error("Error fetching tasks:", errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const fetchTaskStats = createAsyncThunk("tasks/fetchTaskStats", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as any;
    if (!auth.token) {
      console.error("No auth token found when fetching task stats");
      return rejectWithValue("Not authenticated");
    }

    const stats = await taskApi.getTaskStats(auth.token);
    return stats;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch task stats";
    console.error("Error fetching task stats:", errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const fetchTaskById = createAsyncThunk("tasks/fetchTaskById", async (taskId: number, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as any;
    if (!auth.token) return rejectWithValue("Not authenticated");

    const task = await taskApi.getTaskById(auth.token, taskId);
    return task;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch task");
  }
});

export const createTask = createAsyncThunk("tasks/createTask", async (taskData: TaskCreateData, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as any;
    if (!auth.token) return rejectWithValue("Not authenticated");

    const response = await taskApi.createTask(auth.token, taskData);
    return response.task;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create task");
  }
});

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updateData }: { taskId: number; updateData: TaskUpdateData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as any;
      if (!auth.token) return rejectWithValue("Not authenticated");

      const response = await taskApi.updateTask(auth.token, taskId, updateData);
      return response.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId: number, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as any;
    if (!auth.token) return rejectWithValue("Not authenticated");

    await taskApi.deleteTask(auth.token, taskId);
    return taskId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete task");
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchTaskStats.rejected, (state, action) => {
        toast.error(action.payload as string);
      })

      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks = [action.payload, ...state.tasks];
        toast.success("Task created successfully");
      })
      .addCase(createTask.rejected, (state, action) => {
        toast.error(action.payload as string);
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task));
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
        toast.success("Task updated successfully");
      })
      .addCase(updateTask.rejected, (state, action) => {
        toast.error(action.payload as string);
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
        toast.success("Task deleted successfully");
      })
      .addCase(deleteTask.rejected, (state, action) => {
        toast.error(action.payload as string);
      });
  },
});

export const { setFilters, clearCurrentTask } = tasksSlice.actions;
export default tasksSlice.reducer;
