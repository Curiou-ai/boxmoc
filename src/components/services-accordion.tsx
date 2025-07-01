
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
        title: "Product Design Teams",
        description: "A single platform for product teams to deliver customer value faster. From strategic planning to a production-ready box design, it all lives here.",
        learnMoreUrl: "#"
    },
    {
        value: "item-2",
        title: "Marketing Agencies",
        description: "Empower your marketing campaigns with stunning, on-brand packaging that captures attention and tells a story. Fast, collaborative, and scalable.",
        learnMoreUrl: "#"
    },
    {
        value: "item-3",
        title: "E-commerce Brands",
        description: "Create unforgettable unboxing experiences for your customers. Design, visualize, and order custom packaging that elevates your brand identity.",
        learnMoreUrl: "#"
    },
    {
        value: "item-4",
        title: "Packaging Engineers",
        description: "Streamline your workflow with powerful 3D previews and AI-powered tools. Test structural integrity and design aesthetics in one place.",
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
