
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const services = [
    {
        value: "item-1",
        title: "General Use",
        description: "Design and purchase custom branded boxes for various use cases to meet your promotional needs",
        learnMoreUrl: "#"
    },
    {
        value: "item-2",
        title: "Product Design",
        description: "A single platform for product teams to deliver customer value faster. From strategic planning to production-ready packaging and promotional materials, it all lives here.",
        learnMoreUrl: "#"
    },
    {
        value: "item-3",
        title: "Marketing",
        description: "Empower your marketing campaigns with stunning, on-brand designs for package boxes for your team that capture attention. Fast, collaborative, and scalable.",
        learnMoreUrl: "#"
    },
    {
        value: "item-4",
        title: "E-commerce Brands",
        description: "Create unforgettable brand experiences for your customers. Design everything from custom packaging that elevate your brand identity.",
        learnMoreUrl: "#"
    },
    {
        value: "item-5",
        title: "Event Planners",
        description: "Create and deliver captivating custom gift boxes for your events. Ensure every touchpoint is perfectly on-brand.",
        learnMoreUrl: "#"
    }
]

export function ServicesAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
        {services.map((service) => (
            <AccordionItem value={service.value} key={service.value}>
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                    {service.title}
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                    <p className="text-muted-foreground">
                        {service.description}
                    </p>
                    <Button asChild variant="secondary" className="bg-foreground text-background hover:bg-foreground/90">
                        <Link href={service.learnMoreUrl}>Learn more</Link>
                    </Button>
                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
  )
}
