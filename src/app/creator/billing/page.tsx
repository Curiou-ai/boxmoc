
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check } from "lucide-react"

const plans = [
    { name: "Starter", price: "$10/mo", description: "For individuals and hobbyists.", features: ["10 AI Credits", "Basic 3D Previews"] },
    { name: "Pro", price: "$35/mo", description: "For professionals and small teams.", features: ["Unlimited AI Credits", "HD 3D Previews", "Team Collaboration (5 seats)"] },
    { name: "Enterprise", price: "Custom", description: "For large organizations.", features: ["Everything in Pro", "Dedicated Support", "API Access"] },
]

export default function BillingPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
       <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-2">Billing</h1>
        <p className="text-muted-foreground">Manage your payment methods and subscription plan.</p>
      </div>
      
      <div className="grid gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Add a payment method to your account for subscriptions or one-time orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <form className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name on card</Label>
                    <Input id="name" placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="card-number">Card number</Label>
                    <Input id="card-number" placeholder="•••• •••• •••• ••••" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="month">Expires</Label>
                    <Select>
                        <SelectTrigger id="month">
                        <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        <SelectItem value="4">April</SelectItem>
                        <SelectItem value="5">May</SelectItem>
                        <SelectItem value="6">June</SelectItem>
                        <SelectItem value="7">July</SelectItem>
                        <SelectItem value="8">August</SelectItem>
                        <SelectItem value="9">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="year" className="invisible">Year</Label>
                    <Select>
                        <SelectTrigger id="year">
                        <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                            {new Date().getFullYear() + i}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="CVC" />
                    </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="save-card" defaultChecked />
                    <Label htmlFor="save-card" className="text-sm font-normal">Save this card for future purchases</Label>
                </div>
            </form>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button>Save Payment Method</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>You are currently on the <span className="font-semibold text-primary">Pro</span> plan.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {plans.map(plan => (
                <Card key={plan.name} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline">{plan.name}</CardTitle>
                        <p className="text-2xl font-bold">{plan.price}</p>
                        <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-2 text-sm">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant={plan.name === 'Pro' ? 'default' : 'outline'} className="w-full">
                           {plan.name === 'Pro' ? 'Current Plan' : 'Select Plan'}
                        </Button>
                    </CardFooter>
                </Card>
             ))}
          </CardContent>
           <CardFooter className="border-t pt-6 flex-col items-start gap-2 text-sm text-muted-foreground">
                <p>Your subscription will renew on August 1, 2024.</p>
                <Button variant="link" className="p-0 h-auto text-destructive">Cancel Subscription</Button>
           </CardFooter>
        </Card>
      </div>
    </div>
  )
}
