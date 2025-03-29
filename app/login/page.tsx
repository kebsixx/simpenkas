import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Simpenkas</h1>
          <p className="text-gray-600 mt-2">Sistem Pencatatan Keuangan</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

