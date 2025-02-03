import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/sign-in"],
  afterAuth(auth, req) {
    // Redirect authenticated users to home page if they're on a public route
    if (auth.userId && auth.isPublicRoute) {
      const homeUrl = new URL("/home", req.url)
      return Response.redirect(homeUrl)
    }
  },
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

