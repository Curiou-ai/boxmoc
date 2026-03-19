import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { AppHeader } from "@/components/header";

// Force dynamic rendering to prevent prerendering errors during build
// as this layout relies on server-side session cookies and Firebase Admin.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
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
