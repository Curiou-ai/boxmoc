'use client';

import { ContactSubmission } from "@/app/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Eye, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ContactSubmissionTable({ submissions }: { submissions: ContactSubmission[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {submissions.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No inquiries found.</TableCell>
                    </TableRow>
                )}
                {submissions.map(sub => (
                    <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.name}</TableCell>
                        <TableCell>{sub.email}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="capitalize">{sub.source}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(sub.createdAt), 'PP')}</TableCell>
                        <TableCell className="text-right">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4 mr-2" /> View
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[550px]">
                                    <DialogHeader>
                                        <DialogTitle>Submission from {sub.name}</DialogTitle>
                                        <DialogDescription>
                                            Submitted via {sub.source} on {format(new Date(sub.createdAt), 'PPPP p')}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground font-medium uppercase text-[10px]">Email</p>
                                                <p className="font-medium">{sub.email}</p>
                                            </div>
                                            {sub.phone && (
                                                <div>
                                                    <p className="text-muted-foreground font-medium uppercase text-[10px]">Phone</p>
                                                    <p className="font-medium">{sub.phone}</p>
                                                </div>
                                            )}
                                            {sub.company && (
                                                <div>
                                                    <p className="text-muted-foreground font-medium uppercase text-[10px]">Company</p>
                                                    <p className="font-medium">{sub.company}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg border">
                                            <p className="text-muted-foreground font-medium uppercase text-[10px] mb-2">Message</p>
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{sub.message}</p>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={`mailto:${sub.email}`}>
                                                    <Mail className="h-4 w-4 mr-2" /> Reply via Email
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
