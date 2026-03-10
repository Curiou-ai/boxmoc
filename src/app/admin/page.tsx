import { getWaitlistUsers, getContactSubmissions, getCRMUsers } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "@/components/admin/user-table";
import { ContactSubmissionTable } from "@/components/admin/contact-submission-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { SendAccessCodeButton } from "@/components/admin/send-access-code-button";

export default async function AdminPage() {
    const waitlistUsers = await getWaitlistUsers();
    const contactSubmissions = await getContactSubmissions();
    const crmUsers = await getCRMUsers();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold font-headline mb-8">CRM Dashboard</h1>
            
            <Tabs defaultValue="customers" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
                    <TabsTrigger value="contacts">Inquiries</TabsTrigger>
                </TabsList>

                <TabsContent value="customers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Base</CardTitle>
                            <CardDescription>Monitor product usage, subscription health, and interaction logs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserTable users={crmUsers} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="waitlist">
                    <Card>
                        <CardHeader>
                            <CardTitle>Early Access Pipeline</CardTitle>
                            <CardDescription>Manage leads awaiting platform invitations.</CardDescription>
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
                            <CardTitle>Recent Interactions</CardTitle>
                            <CardDescription>Support requests and feedback loops.</CardDescription>
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
