"use client"

import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { setSidebarOpen } from "../../store/slices/uiSlice"
import Navbar from "./navbar"
import Sidebar from "./sidebar"

export default function Layout() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { sidebarOpen } = useSelector((state: RootState) => state.ui)

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebarOpen(false))
      } else {
        dispatch(setSidebarOpen(true))
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [dispatch])

  // Close sidebar on navigation on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      dispatch(setSidebarOpen(false))
    }
  }, [location.pathname, dispatch])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className={`mx-auto max-w-7xl transition-all duration-300 ${sidebarOpen ? "md:ml-0" : "md:ml-0"}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
