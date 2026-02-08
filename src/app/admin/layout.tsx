import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { AppHeader } from "@/components/header";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getSession();
    
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
        return (
            <div className="container mx-auto max-w-2xl py-20">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Configuration Error</AlertTitle>
                    <AlertDescription>
                        The `ADMIN_EMAIL` environment variable is not set. The admin dashboard cannot be accessed.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!session || session.email !== adminEmail) {
        redirect('/creator');
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AppHeader />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
