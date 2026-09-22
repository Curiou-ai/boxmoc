'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI design process work?",
    answer: "Simply describe your brand vision in plain text—for example, 'A minimalist floral pattern for a luxury candle'—and our AI Designer Assistant generates production-ready concepts in seconds. You can then refine these designs using our manual tools or request help from an expert."
  },
  {
    question: "What are the differences between the product tiers?",
    answer: "We offer three distinct tiers: 'The Custom Shipper' (Standard cardboard for e-commerce), 'The Elegant Retailer' (Premium heavy-duty paper for luxury boutiques), and 'The Bespoke Keepsake' (Indestructible 3D-printed materials for high-end events and VIP gifts)."
  },
  {
    question: "Is the 3D preview accurate to the final product?",
    answer: "Yes! Our real-time 3D engine provides 99% design accuracy. What you see on your screen—including dimensions, material finishes (matte, semi-gloss, or metallic), and artwork placement—is exactly what our production facilities use to manufacture your order."
  },
  {
    question: "What are the minimum order quantities?",
    answer: "We offer some of the lowest minimums in the industry: 10 units for Shippers, 5 units for Retailer boxes, and as low as 1 unit for our 3D-printed Bespoke Keepsakes."
  },
  {
    question: "How long does production and shipping take?",
    answer: "Our automated workflow reduces traditional production time by 1.8X. Once you approve a design, items are typically produced and shipped within 7-14 business days, depending on your location and the selected tier."
  },
  {
    question: "Can I use my own brand assets and logos?",
    answer: "Absolutely. Our Creator Studio allows you to upload high-resolution logos (including SVG support), choose custom colors, and add text with a wide range of professional fonts to ensure your box stays on-brand."
  }
];

export function FaqSection() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-background flex items-center justify-center">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Everything you need to know about Boxmoc's AI design platform and production process.
          </p>
        </div>
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-muted py-2">
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
