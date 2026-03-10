import { getWaitlistUsers, getContactSubmissions } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { SendAccessCodeButton } from "@/components/admin/send-access-code-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactSubmissionTable } from "@/components/admin/contact-submission-table";

export default async function AdminPage() {
    const waitlistUsers = await getWaitlistUsers();
    const contactSubmissions = await getContactSubmissions();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold font-headline mb-8">Admin Dashboard</h1>
            
            <Tabs defaultValue="waitlist" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="waitlist">Waitlist Management</TabsTrigger>
                    <TabsTrigger value="contacts">Contact Inquiries</TabsTrigger>
                </TabsList>

                <TabsContent value="waitlist">
                    <Card>
                        <CardHeader>
                            <CardTitle>Waitlist Users</CardTitle>
                            <CardDescription>Manage early access for your users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined On</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {waitlistUsers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No users on the waitlist.</TableCell>
                                        </TableRow>
                                    )}
                                    {waitlistUsers.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    user.status === 'active' ? 'default' :
                                                    user.status === 'redeemed' ? 'secondary' :
                                                    'outline'
                                                }>{user.status}</Badge>
                                            </TableCell>
                                            <TableCell>{format(new Date(user.createdAt), 'PPpp')}</TableCell>
                                            <TableCell className="text-right">
                                                {user.status === 'waitlisted' && (
                                                    <SendAccessCodeButton email={user.email} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contacts">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Inquiries</CardTitle>
                            <CardDescription>View messages sent from the contact form and chatbot.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactSubmissionTable submissions={contactSubmissions} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
