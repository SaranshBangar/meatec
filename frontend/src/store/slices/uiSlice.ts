import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  theme: "light" | "dark"
  sidebarOpen: boolean
}

const initialState: UiState = {
  theme: (localStorage.getItem("task-manager-theme") as "light" | "dark") || "dark",
  sidebarOpen: true,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
      localStorage.setItem("task-manager-theme", action.payload)
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
  },
})

export const { setTheme, toggleSidebar, setSidebarOpen } = uiSlice.actions
export default uiSlice.reducer
