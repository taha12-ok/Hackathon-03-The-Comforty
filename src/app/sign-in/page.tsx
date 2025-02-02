import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="bg-white p-4 sm:p-8 shadow-sm sm:shadow rounded-lg">
          <SignIn
            appearance={{
              elements: {
                card: "shadow-none",
                headerTitle: "text-xl sm:text-2xl",
                headerSubtitle: "text-sm",
                socialButtonsBlockButton: "text-sm",
                formFieldInput: "text-sm sm:text-base",
                formFieldLabel: "text-sm",
                footer: "text-sm",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

