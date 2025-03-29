"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // In a real app, you'd use Supabase Auth, but for this example we'll query the users table
      const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

      if (error) {
        console.error("Login error:", error)
        setError("Login gagal, silakan coba lagi")
        return
      }

      if (data && data.password === password) {
        // Set a session cookie or token here
        // For simplicity, we'll just redirect to dashboard
        localStorage.setItem("simpenkas_user", JSON.stringify({ email: data.email }))
        router.push("/dashboard")
      } else {
        setError("Login gagal, silakan coba lagi")
      }
    } catch (error) {
      setError("Login gagal, silakan coba lagi")
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login Admin</CardTitle>
        <CardDescription>Masuk ke dashboard Simpenkas</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading} onClick={handleLogin}>
          {loading ? "Memproses..." : "Login"}
        </Button>
      </CardFooter>
    </Card>
  )
}

