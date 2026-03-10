'use client';

import React, { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Plus, MessageSquare, History, User, Activity, CreditCard } from "lucide-react";
import { CRMUser, ContactSubmission, addCRMNote, updateCRMUserStatus, updateContactStatus } from "@/app/actions";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface CRMDetailsDialogProps {
    type: 'user' | 'contact';
    record: CRMUser | ContactSubmission;
}

export function CRMDetailsDialog({ type, record }: CRMDetailsDialogProps) {
    const [note, setNote] = useState('');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const isUser = type === 'user';
    const user = record as CRMUser;
    const contact = record as ContactSubmission;

    const handleAddNote = () => {
        if (!note.trim()) return;
        startTransition(async () => {
            const result = await addCRMNote(type, record.id || user.uid, note);
            if (result.success) {
                setNote('');
                toast({ title: "Note added", description: "Internal interaction recorded successfully." });
            }
        });
    };

    const handleStatusChange = (newStatus: string) => {
        startTransition(async () => {
            let result;
            if (isUser) {
                result = await updateCRMUserStatus(user.uid, newStatus);
            } else {
                result = await updateContactStatus(contact.id, newStatus);
            }
            if (result.success) {
                toast({ title: "Status updated", description: `Record moved to ${newStatus}.` });
            }
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-2" /> Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                                {isUser ? <User className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                                {record.name || (user.displayName) || 'Customer Details'}
                            </DialogTitle>
                            <DialogDescription>{record.email}</DialogDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold">Lifecycle Stage</Label>
                            <Select 
                                defaultValue={isUser ? user.status : contact.status} 
                                onValueChange={handleStatusChange}
                                disabled={isPending}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Update Stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isUser ? (
                                        <>
                                            <SelectItem value="onboarding">Onboarding</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="trialing">Trialing</SelectItem>
                                            <SelectItem value="churned">Churned</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="new">New Lead</SelectItem>
                                            <SelectItem value="contacted">Contacted</SelectItem>
                                            <SelectItem value="closed">Closed</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-0 border-t mt-6">
                    {/* Sidebar: Metadata */}
                    <div className="bg-muted/30 p-6 border-r flex flex-col gap-6">
                        <section className="space-y-4">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                <Activity className="h-3 w-3" /> Account Info
                            </h4>
                            <div className="space-y-2">
                                <div className="text-xs">
                                    <p className="text-muted-foreground">Joined</p>
                                    <p className="font-medium">{format(new Date(record.createdAt), 'PP')}</p>
                                </div>
                                {isUser && (
                                    <div className="text-xs">
                                        <p className="text-muted-foreground">Last Activity</p>
                                        <p className="font-medium">{user.lastActiveAt ? format(new Date(user.lastActiveAt), 'PPp') : 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {isUser && (
                            <section className="space-y-4">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" /> Billing
                                </h4>
                                <div className="space-y-2">
                                    <div className="text-xs">
                                        <p className="text-muted-foreground">Status</p>
                                        <Badge variant="outline" className="capitalize">{user.stripeSubscriptionStatus || 'Free'}</Badge>
                                    </div>
                                    {user.stripeCurrentPeriodEnd && (
                                        <div className="text-xs">
                                            <p className="text-muted-foreground">Renews</p>
                                            <p className="font-medium">{format(new Date(user.stripeCurrentPeriodEnd * 1000), 'PP')}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                        
                        {!isUser && contact.message && (
                            <section className="space-y-4">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground">Inquiry Content</h4>
                                <div className="p-3 bg-background rounded border text-xs italic line-clamp-6">
                                    "{contact.message}"
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Main: Interaction History */}
                    <div className="md:col-span-2 flex flex-col">
                        <div className="p-4 border-b bg-background sticky top-0 z-10">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2 mb-3">
                                <History className="h-3 w-3" /> Internal History & Notes
                            </h4>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Add an internal log or note..." 
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="flex-1"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                />
                                <Button size="icon" onClick={handleAddNote} disabled={!note.trim() || isPending}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                {(record.notes || []).length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground text-sm">
                                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                        No internal notes recorded yet.
                                    </div>
                                ) : (
                                    record.notes?.map((n) => (
                                        <div key={n.id} className="p-4 bg-muted/20 rounded-lg border text-sm space-y-1">
                                            <div className="flex justify-between items-center text-[10px] uppercase text-muted-foreground font-bold">
                                                <span>{n.author}</span>
                                                <span>{format(new Date(n.createdAt), 'PPp')}</span>
                                            </div>
                                            <p className="text-foreground leading-relaxed">{n.content}</p>
                                        </div>
                                    )).reverse()
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
