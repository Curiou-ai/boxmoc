import { getWaitlistUsers } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { SendAccessCodeButton } from "@/components/admin/send-access-code-button";

export default async function AdminPage() {
    const users = await getWaitlistUsers();

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Waitlist Management</CardTitle>
                    <CardDescription>Manage users on the waitlist and send out access codes.</CardDescription>
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
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No users on the waitlist.</TableCell>
                                </TableRow>
                            )}
                            {users.map(user => (
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
        </div>
    );
}
