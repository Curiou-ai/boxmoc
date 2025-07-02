import React from 'react';
import { BrainCircuit, Paintbrush, PackageCheck, Truck } from 'lucide-react';
import { cn } from "@/lib/utils"

const workflowSteps = [
    {
        icon: <BrainCircuit className="h-10 w-10 text-primary" />,
        title: "1. Describe Your Vision",
        description: "Start with a simple text prompt. Describe your idea, and our AI will generate unique design concepts for packaging, cards, flyers, and more in seconds."
    },
    {
        icon: <Paintbrush className="h-10 w-10 text-primary" />,
        title: "2. Customize & Preview",
        description: "Refine your favorite design. Use our intuitive tools to add logos, text, and graphics. See your creation come to life from every angle with our instant 3D previews."
    },
    {
        icon: <PackageCheck className="h-10 w-10 text-primary" />,
        title: "3. Finalize & Order",
        description: "Once your design is perfect, choose your materials and quantities. Our straightforward ordering process makes it easy to move from design to production."
    },
    {
        icon: <Truck className="h-10 w-10 text-primary" />,
        title: "4. Production & Shipping",
        description: "We handle the rest. Our network of high-quality printers and manufacturers produce your items with care and precision, shipping them directly to your door."
    }
];

const FlowArrow = ({ className }: { className?: string }) => (
    <div className={cn("flex-shrink-0 px-4", className)}>
        <svg
            width="114"
            height="66"
            viewBox="0 0 114 66"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
        >
            <path
                d="M1 65C1 65 31.5001 5.99998 57 5.99998C82.5 6 113 65 113 65"
                className="text-primary/30"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1 65C1 65 31.5001 5.99998 57 5.99998C82.5 6 113 65 113 65"
                className="text-primary animate-dash-flow"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 8"
            />
            <path d="M108 55L113 65L103 64" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

export function WorkflowSteps() {
  return (
    <section id="workflow" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 lg:mb-20">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            From Idea to Delivery
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Our streamlined process makes bringing your creations to life effortless.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 xl:gap-4">
          {workflowSteps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-2 w-full max-w-[280px] group h-72">
                <div className="mb-4 p-4 bg-primary/10 rounded-full transition-colors group-hover:bg-primary/20">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold font-headline mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm flex-grow">{step.description}</p>
              </div>

              {index < workflowSteps.length - 1 && (
                <>
                  <div className="lg:hidden h-12 w-px bg-border border-dashed"></div>
                  <FlowArrow className={cn("hidden lg:block", index === 1 && "transform rotate-180")} />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}