
import { getUserOrders, Order } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function OrderRow({ order }: { order: Order }) {
    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-4">
                    <Image
                        src={order.designImageUrl}
                        alt={order.designDescription}
                        width={64}
                        height={64}
                        className="rounded-md object-cover bg-muted"
                    />
                    <div>
                        <p className="font-medium">Custom Design Print</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-xs">{order.designDescription}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>{format(new Date(order.createdAt), 'PP')}</TableCell>
            <TableCell>
                <Badge variant={order.status === 'shipped' ? 'default' : 'secondary'} className="capitalize">{order.status}</Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
                ${(order.amount / 100).toFixed(2)}
            </TableCell>
        </TableRow>
    );
}


export default async function OrdersPage() {
    const orders = await getUserOrders();

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold font-headline mb-2">My Orders</h1>
                <p className="text-muted-foreground">Review your past purchases and track their status.</p>
            </div>
            
            <div className="max-w-5xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <Alert className="flex flex-col items-center justify-center text-center p-8">
                                <ShoppingBag className="h-10 w-10 mb-4" />
                                <AlertTitle className="mb-2 text-lg font-semibold">No Orders Yet</AlertTitle>
                                <AlertDescription className="mb-4">
                                    You haven't placed any orders. Create a design and order a print from the editor.
                                </AlertDescription>
                                <Button asChild>
                                    <Link href="/creator">Go to Editor</Link>
                                </Button>
                            </Alert>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map(order => <OrderRow key={order.id} order={order} />)}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
