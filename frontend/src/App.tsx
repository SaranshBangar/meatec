"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Toaster } from "sonner"
import type { RootState } from "./store"
import { checkAuth } from "./store/slices/authSlice"
import ProtectedRoute from "./components/auth/protected-route"
import AnimateWrapper from "./components/ui/animate-wrapper"
import Layout from "./components/layout/layout"
import Dashboard from "./pages/dashboard"
import Login from "./pages/login"
import Register from "./pages/register"
import Profile from "./pages/profile"
import Tasks from "./pages/tasks"
import TaskDetail from "./pages/task-detail"

export default function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(checkAuth() as any)
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <>
      <AnimateWrapper>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimateWrapper>
      <Toaster position="top-right" richColors />
    </>
  )
}
