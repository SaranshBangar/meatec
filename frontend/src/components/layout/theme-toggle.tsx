"use client"

import { useDispatch } from "react-redux"
import { Moon, Sun } from "lucide-react"
import { setTheme } from "../../store/slices/uiSlice"
import { Button } from "@/components/ui/button"
import { useTheme } from "../theme-provider"

export default function ThemeToggle() {
  const dispatch = useDispatch()
  const { theme } = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    dispatch(setTheme(newTheme))
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
