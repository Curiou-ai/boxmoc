'use client';

import { CRMUser } from "@/app/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Eye, UserCircle } from "lucide-react";
import { CRMDetailsDialog } from "./crm-details-dialog";

export function UserTable({ users }: { users: CRMUser[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No customers found.</TableCell>
                    </TableRow>
                )}
                {users.map(user => (
                    <TableRow key={user.uid}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <UserCircle className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{user.displayName || 'Anonymous User'}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="capitalize">
                                {user.stripeSubscriptionStatus || 'Free'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={user.status === 'active' ? 'default' : 'outline'} className="capitalize">
                                {user.status || 'unknown'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                            {user.lastActiveAt ? `${formatDistanceToNow(new Date(user.lastActiveAt))} ago` : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                            <CRMDetailsDialog type="user" record={user} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
