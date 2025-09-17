"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-full justify-start"
    >
      {theme === "dark" ? <Sun className="mr-2 w-4 h-4" /> : <Moon className="mr-2 w-4 h-4" />}
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </Button>
  )
}
