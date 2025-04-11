"use client"

import { useSelector, useDispatch } from "react-redux"
import { NavLink } from "react-router-dom"
import { X, LayoutDashboard, CheckSquare, User } from "lucide-react"
import type { RootState } from "../../store"
import { toggleSidebar } from "../../store/slices/uiSlice"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const dispatch = useDispatch()
  const { sidebarOpen } = useSelector((state: RootState) => state.ui)
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => dispatch(toggleSidebar())} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-card transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">TaskMaster</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => dispatch(toggleSidebar())} className="md:hidden">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="py-4">
          <div className="mb-6 px-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-lg font-medium text-primary-foreground">{user?.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 px-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`
              }
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`
              }
            >
              <CheckSquare className="mr-3 h-5 w-5" />
              Tasks
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`
              }
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  )
}
