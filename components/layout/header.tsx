"use client"

import { useEffect, useState } from "react"
import { BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("simpenkas_user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        setUserEmail(userData.email || "Admin")
      } catch (e) {
        setUserEmail("Admin")
      }
    }
  }, [])

  return (
    <header className="flex h-16 items-center px-6 border-b bg-background">
      <div className="flex items-center ml-auto">
        <Button variant="ghost" size="icon">
          <BellIcon className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <span className="ml-4 text-sm font-medium">{userEmail}</span>
      </div>
    </header>
  )
}

