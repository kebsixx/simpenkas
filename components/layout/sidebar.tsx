"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, PlusCircle, MinusCircle, FileText, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tambah Penerimaan",
    href: "/dashboard/income/add",
    icon: PlusCircle,
  },
  {
    title: "Tambah Pengeluaran",
    href: "/dashboard/expense/add",
    icon: MinusCircle,
  },
  {
    title: "Laporan Keuangan",
    href: "/dashboard/reports",
    icon: FileText,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("simpenkas_user")
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="flex flex-col h-full">
            <div className="py-4 border-b">
              <h2 className="text-lg font-semibold px-4">Simpenkas</h2>
            </div>
            <nav className="flex-1 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="py-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-muted rounded-md w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex flex-col h-full border-r bg-background", className)}>
        <div className="py-4 border-b">
          <h2 className="text-lg font-semibold px-6">Simpenkas</h2>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-2 text-sm font-medium rounded-md",
                pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-2 text-sm font-medium text-red-500 hover:bg-muted rounded-md w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

