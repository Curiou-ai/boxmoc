import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { AppHeader } from "@/components/header";

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
