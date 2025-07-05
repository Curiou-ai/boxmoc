import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Box, Facebook } from "lucide-react"

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0 1 24 36c-5.222 0-9.643-3.27-11.283-7.94l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-11.303 8c-1.334 0-2.62-.218-3.828-.621l-6.522 5.025C13.186 42.658 18.347 44 24 44c11.045 0 20-8.955 20-20 0-1.341-.138-2.65-.389-3.917z" />
    </svg>
)

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C9.462 2 7.5 3.731 7.5 6.125c0 2.261 1.637 3.469 1.637 3.469s-1.887.894-1.887 2.812c0 2.406 2.25 3.337 2.25 3.337s.213 4.25-.188 5.25c.3.025.637.038 1.012.038 1.163 0 2.2-.338 2.925-.763.788.463 1.875.825 3.113.825 2.587 0 4.125-2.075 4.125-4.088 0-2.012-1.288-2.9-2.863-2.9-1.488 0-2.313.887-3.612.887-.138 0-.275 0-.413-.013a.17.17 0 0 1-.162-.125c-.013-.038-.025-.075-.025-.113 0-.025.013-.05.013-.075 0-.612.35-1.163.95-1.575C16.025 8.175 16.5 7.113 16.5 6.025 16.5 3.65 14.537 2 12 2zM12.875.025c.825 0 1.575.45 2.025 1.137.613.975.3 2.45-.775 3.125-.737.512-1.637.662-2.287.162-.7-.6-1.012-1.787-.4-2.837C11.825.437 12.325.025 12.875.025z"/>
    </svg>
);


export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
       <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Box className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold">Boxmoc</span>
            </Link>
            <Link href="/login" className="text-sm font-medium hover:underline text-foreground">
                Log in
            </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-sm px-4">
          <div className="text-center mb-8">
            <Box className="h-10 w-10 text-primary mx-auto" />
            <h1 className="text-3xl font-bold font-headline mt-4">Create your account</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
          
          <div className="space-y-6">
              <form className="space-y-4 text-left">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="myemail@email.com"
                    required
                  />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    type="text"
                    placeholder="Your company name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required placeholder="Enter your password" />
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </form>
              
              <div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                    <Button variant="outline" className="w-full">
                      <Facebook className="mr-2 text-[#1877F2]" />
                      Facebook
                    </Button>
                    <Button variant="outline" className="w-full">
                      <GoogleIcon className="mr-2" />
                      Google
                    </Button>
                    <Button variant="outline" className="w-full">
                      <AppleIcon className="mr-2" />
                      Apple
                    </Button>
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground px-4">
                 By signing up, you agree to our{" "}
                 <Link
                    href="#"
                    className="underline hover:text-primary"
                >
                    Terms of Use
                </Link> and {" "}
                 <Link
                    href="#"
                    className="underline hover:text-primary"
                >
                    Privacy Policy
                </Link>.
              </div>
          </div>

        </div>
      </main>
    </div>
  )
}
